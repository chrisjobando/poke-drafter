<script lang="ts">
	// Forms
	import { enhance } from '$app/forms';
	// Components
	import Alert from '$lib/components/form/Alert.svelte';
	import EmailInput from '$lib/components/form/EmailInput.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	// Interfaces
	import type { IRegisterErrors } from '$lib/db/schema/UserSchema';

	export let form;

	// Form Validation
	let formErrors: IRegisterErrors | undefined;

	$: if (form) {
		if (form.success) {
			// Clear loading
			formErrors = undefined;
		} else {
			if ('errors' in form && form.errors) {
				formErrors = form.errors as IRegisterErrors;
			}
		}
	}
</script>

<svelte:head>
	<title>Sign Up</title>
	<meta name="description" content="Sign up for PokeDrafter" />
</svelte:head>

<div class="card">
	<h1 class="card-title">Sign Up</h1>

	<form
		class="card-body"
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				// Prevent clearing form inputs on submit
				await update({ reset: false });
			};
		}}
	>
		{#if form && form.message.length > 0}
			<Alert
				message={form.message}
				type={form.success ? 'success' : 'warning'}
				onDestroyCallback={() => {
					if (form) {
						form.message = '';
					}
				}}
			/>
		{/if}

		<EmailInput required errorMessage={formErrors?.email} />
		<PasswordInput required label="Password" name="password" errorMessage={formErrors?.password} />
		<PasswordInput
			required
			label="Confirm Password"
			name="confirm_password"
			errorMessage={formErrors?.confirm_password}
		/>

		<button class="btn btn-primary" type="submit">Submit</button>
		<p>Already have an account? <a class="text-primary" href="/auth/signin">Sign in</a></p>
	</form>
</div>
