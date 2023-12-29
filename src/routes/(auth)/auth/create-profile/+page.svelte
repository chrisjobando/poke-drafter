<script lang="ts">
	// Components
	import { TextInput } from '$lib/components/forms/index.js';
	import { Button, Heading } from 'flowbite-svelte';
	// Interfaces
	import type { ICreateTrainerErrors } from '$lib/db/schema/UserSchema.js';

	// Form Data
	const { form } = $props();

	// Form Validation
	let formErrors = $state<ICreateTrainerErrors>();

	$effect(() => {
		if (form) {
			if (form.success) {
				// Clear loading
				formErrors = undefined;
			} else {
				if ('errors' in form && form.errors) {
					formErrors = form.errors as ICreateTrainerErrors;
				}
			}
		}
	});
</script>

<svelte:head>
	<title>Create Profile</title>
	<meta name="description" content="Create your PokeDrafter profile" />
</svelte:head>

<form class="flex flex-col space-y-6" method="post">
	<Heading class="text-gray-900 dark:text-white" tag="h3">Create Profile</Heading>

	<div class="mb-6">
		<TextInput
			required
			id="name"
			label="Trainer Name"
			name="name"
			placeholder="Ash Ketchum"
			textError={formErrors?.name}
		/>
	</div>

	<Button class="mb-6 w-full" type="submit">Submit</Button>
</form>
