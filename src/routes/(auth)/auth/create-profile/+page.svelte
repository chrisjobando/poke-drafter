<script lang="ts">
	// Forms
	import { enhance } from '$app/forms';
	// Components
	import TextInput from '$lib/components/form/TextInput.svelte';
</script>

<svelte:head>
	<title>Create Profile</title>
	<meta name="description" content="Create your PokeDrafter profile" />
</svelte:head>

<div class="card">
	<h1 class="card-title">Create Profile</h1>

	<form
		class="card-body"
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				// Prevent clearing form input on submit
				await update({ reset: false });
			};
		}}
	>
		<TextInput
			required
			autocomplete="given-name"
			label="Name"
			name="name"
			placeholder="Ash Ketchum"
		/>

		<button class="btn btn-primary" type="submit">Let's Go!</button>
	</form>
</div>
