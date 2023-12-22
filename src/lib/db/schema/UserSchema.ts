import { z } from 'zod';

// Rules
const nullable = (name: string, max = 999, min = 0) =>
  z
    .string()
    .min(min, `${name} must be at least ${min} characters`)
    .max(max, `${name} must be at most ${max} characters`)
    .nullable()
    .optional();
const nullableNum = (name: string) =>
  z
    .number()
    .min(1900, `${name} must be after 1900`)
    .max(new Date().getFullYear(), `${name} cannot be in the future`)
    .nullable()
    .optional();
const required = (name: string, max = 999) =>
  z.string().min(1, `${name} is required`).max(max, `${name} must be at most ${max} characters`);
const email = (name = 'Email') => required(name, 100).email(`${name} is not valid`);
const password = (number = 6, name = 'Password') =>
  required(name).min(number, `${name} must be at least ${number} characters`);

// Validation Schemas
export const RegisterSchema = z
  .object({
    email: email(),
    password: password(),
    confirm_password: password()
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirm_password'],
        message: 'The passwords did not match'
      });
    }
  });


export const LoginSchema = z.object({
    email: email(),
    password: password()
  });

  // Form Error Schemas
export interface IRegisterErrors {
    email?: string;
    password?: string;
    confirm_password?: string;
  }
  
  export interface ILoginErrors {
    email?: string;
    password?: string;
  }