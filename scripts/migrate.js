#!/usr/bin/env node

/**
 * Migration script — runs SQL migrations against your Supabase PostgreSQL database.
 *
 * Tracks applied migrations in a `schema_migrations` table so each file
 * is only executed once. Safe to re-run at any time.
 *
 * Usage:
 *   npm run db:migrate
 *
 * Required env var (in .env at project root):
 *   DATABASE_URL — Supabase direct connection string
 *
 * Find it in your Supabase dashboard:
 *   Project Settings → Database → Connection string → URI
 *   (Use the "Direct connection" URI, not the pooler)
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Load .env manually (no extra deps) ──
function loadEnv() {
  try {
    const envFile = readFileSync(resolve(ROOT, '.env'), 'utf-8')
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // .env is optional if vars are already set
  }
}

loadEnv()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set.')
  console.error('')
  console.error('Add it to your .env file:')
  console.error('  DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres')
  console.error('')
  console.error('Find it in your Supabase dashboard:')
  console.error('  Project Settings → Database → Connection string → URI')
  process.exit(1)
}

// ── Discover migration files ──
const migrationsDir = resolve(ROOT, 'supabase', 'migrations')
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

if (files.length === 0) {
  console.log('No migration files found in supabase/migrations/')
  process.exit(0)
}

// ── Connect and run ──
const sql = postgres(DATABASE_URL, { ssl: 'require' })

async function main() {
  console.log(`Database:   ${DATABASE_URL.replace(/\/\/.*:.*@/, '//***:***@')}`)
  console.log(`Migrations: ${files.length} file(s) found\n`)

  // Ensure tracking table exists
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `

  // Fetch already-applied migrations
  const applied = await sql`SELECT filename FROM schema_migrations`
  const appliedSet = new Set(applied.map((r) => r.filename))

  const pending = files.filter((f) => !appliedSet.has(f))

  if (pending.length === 0) {
    console.log('All migrations already applied — nothing to do.')
    await sql.end()
    return
  }

  console.log(`${pending.length} pending migration(s):\n`)

  for (const file of pending) {
    const filePath = resolve(migrationsDir, file)
    const migration = readFileSync(filePath, 'utf-8')

    process.stdout.write(`  Running ${file}... `)

    try {
      await sql.begin(async (tx) => {
        await tx.unsafe(migration)
        await tx`INSERT INTO schema_migrations (filename) VALUES (${file})`
      })
      console.log('done')
    } catch (err) {
      console.log('FAILED')
      console.error(`\n  ${err.message}\n`)
      await sql.end()
      process.exit(1)
    }
  }

  console.log('\nAll migrations applied successfully.')
  await sql.end()
}

main()
