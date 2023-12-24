import { z } from 'zod';

// Rules
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

export const CreateTrainerSchema = z.object({
	name: required('Name', 16)
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

export interface ICreateTrainerErrors {
	name?: string;
}

export interface ILoginErrors {
	email?: string;
	password?: string;
}
