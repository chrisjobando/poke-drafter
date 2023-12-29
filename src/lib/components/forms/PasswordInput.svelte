<script lang="ts">
	// Component
	import { Helper, Input, Label } from 'flowbite-svelte';
	// Interfaces
	interface IPasswordInputProps {
		id: string;
		label: string;
		name: string;
		passwordError?: string;
	}

	const { id, label, name, passwordError } = $props<IPasswordInputProps>();
</script>

<Label color={passwordError ? 'red' : undefined} class="space-y-2" for={id}>
	<span>{label}</span>

	<Input
		required
		color={passwordError ? 'red' : undefined}
		placeholder="•••••••••"
		type="password"
		{id}
		{name}
	/>

	{#if passwordError}
		<Helper class="mt-2" color="red">
			{passwordError}
		</Helper>
	{/if}
</Label>
