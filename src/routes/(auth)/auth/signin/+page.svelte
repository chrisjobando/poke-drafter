<script lang="ts">
	// Component
	import { EmailInput, PasswordInput } from '$lib/components/forms/index.js';
	import { Button, Heading } from 'flowbite-svelte';
	// Interfaces
	import type { ILoginErrors } from '$lib/db/schema/UserSchema.js';

	// Form Data
	const { form } = $props();

	// Form Validation
	let formErrors = $state<ILoginErrors>();

	$effect(() => {
		if (form) {
			if (form.success) {
				// Clear loading
				formErrors = undefined;
			} else {
				if ('errors' in form && form.errors) {
					formErrors = form.errors as ILoginErrors;
				}
			}
		}
	});
</script>

<svelte:head>
	<title>Sign In</title>
	<meta name="description" content="Sign in to PokeDrafter" />
</svelte:head>

<form class="flex flex-col space-y-6" method="post">
	<Heading class="text-gray-900 dark:text-white" tag="h3">Sign in</Heading>

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

	<Button class="mb-6 w-full" type="submit">Submit</Button>

	<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
		Not registered? <a
			href="/auth/signup"
			class="text-primary-700 dark:text-primary-500 hover:underline"
		>
			Create account
		</a>
	</div>
</form>
