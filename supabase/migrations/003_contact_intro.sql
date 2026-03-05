ALTER TABLE profile ADD COLUMN contact_intro text;

UPDATE profile SET contact_intro = 'I''d love to hear from you! Whether you have a project in mind, want to collaborate, or just want to say hello — don''t hesitate to reach out.';
