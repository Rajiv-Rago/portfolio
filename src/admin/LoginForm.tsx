import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginData = z.infer<typeof schema>

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: LoginData) => {
    setError('')
    setLoading(true)
    try {
      await onLogin(data.email, data.password)
    } catch {
      setError('Invalid credentials')
      setValue('password', '')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm bg-surface p-8 rounded-[--radius-lg] border border-border shadow-sm">
        <h1 className="text-2xl font-normal mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message}
          />
          {error && <p className="text-sm text-danger text-center">{error}</p>}
          <Button type="submit" loading={loading} className="w-full justify-center">
            Log In
          </Button>
        </form>
      </div>
    </div>
  )
}
