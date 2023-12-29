<script lang="ts">
	// Components
	import { EmailInput, PasswordInput } from '$lib/components/forms/index.js';
	import { Button, Heading } from 'flowbite-svelte';
	// Interfaces
	import type { IRegisterErrors } from '$lib/db/schema/UserSchema.js';

	// Form Data
	const { form } = $props();

	// Form Validation
	let formErrors = $state<IRegisterErrors>();

	$effect(() => {
		if (form) {
			if (form.success) {
				// Clear loading
				formErrors = undefined;
			} else {
				if ('errors' in form && form.errors) {
					formErrors = form.errors as IRegisterErrors;
				}
			}
		}
	});
</script>

<svelte:head>
	<title>Sign Up</title>
	<meta name="description" content="Sign up for PokeDrafter" />
</svelte:head>

<form class="flex flex-col space-y-6" method="post">
	<Heading class="text-gray-900 dark:text-white" tag="h3">Sign up</Heading>

	<div class="mb-6">
		<EmailInput emailError={formErrors?.email} />
	</div>

	<div class="mb-6">
		<PasswordInput
			id="password"
			label="Password"
			name="password"
			passwordError={formErrors?.password}
		/>
	</div>

	<div class="mb-6">
		<PasswordInput
			id="confirm_password"
			label="Confirm Password"
			name="confirm_password"
			passwordError={formErrors?.confirm_password}
		/>
	</div>

	<Button class="mb-6 w-full" type="submit">Submit</Button>

	<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
		Have an account? <a
			href="/auth/signin"
			class="text-primary-700 dark:text-primary-500 hover:underline"
		>
			Sign in
		</a>
	</div>
</form>
