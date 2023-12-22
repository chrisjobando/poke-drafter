<script lang="ts">
	// Forms
	import { enhance } from '$app/forms';

	export let form;

	$: if (form) {
		console.log('cobando ~ file: +page.svelte:8 ~ form:', form);
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
		<label class="label-text" for="email">Email</label>
		<input class="input input-bordered" name="email" type="email" />

		<label class="label-text" for="password">Password</label>
		<input class="input input-bordered" name="password" type="password" />

		<label class="label-text" for="confirm_password">Confirm Password</label>
		<input class="input input-bordered" type="password" name="confirm_password" />

		<a href="/auth/create-profile" class="btn btn-primary">Submit</a>
		<p>Already have an account? <a class="text-primary" href="/auth/signin">Sign in</a></p>
	</form>
</div>
