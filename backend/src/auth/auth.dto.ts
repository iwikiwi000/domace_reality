import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.email('Neplatný email'),
  password: z.string().min(8, 'Heslo musí mať aspoň 8 znakov'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
