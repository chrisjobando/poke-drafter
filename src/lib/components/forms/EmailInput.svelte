<script lang="ts">
	// Component
	import { Helper, Input, Label } from 'flowbite-svelte';
	// Interfaces
	interface IEmailInputProps {
		emailError?: string;
	}

	const { emailError } = $props<IEmailInputProps>();
</script>

<Label color={emailError ? 'red' : undefined} class="space-y-2" for="email">
	<span>Email address</span>

	<Input
		required
		id="email"
		color={emailError ? 'red' : undefined}
		name="email"
		placeholder="askketchum@pokemon.com"
		type="email"
	/>

	{#if emailError}
		<Helper class="mt-2" color="red">
			{emailError}
		</Helper>
	{/if}
</Label>
