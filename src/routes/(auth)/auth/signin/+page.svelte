<script lang="ts">
	// Forms
	import { enhance } from '$app/forms';
	// Components
	import Alert from '$lib/components/form/Alert.svelte';
	import EmailInput from '$lib/components/form/EmailInput.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	// Interfaces
	import type { ILoginErrors } from '$lib/db/schema/UserSchema';

	export let form;

	// Form Validation
	let formErrors: ILoginErrors | undefined;

	$: if (form) {
		if (form.success) {
			// Clear loading
			formErrors = undefined;
		} else {
			if ('errors' in form && form.errors) {
				formErrors = form.errors as ILoginErrors;
			}
		}
	}
</script>

<svelte:head>
	<title>Sign In</title>
	<meta name="description" content="Sign in to PokeDrafter" />
</svelte:head>

<div class="card">
	<h1 class="card-title">Sign In</h1>

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

		<button class="btn btn-primary" type="submit">Submit</button>
		<p>
			Don't have an account? <a class="text-primary" href="/auth/signup">Create a new account</a>
		</p>
	</form>
</div>
