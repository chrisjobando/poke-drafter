<script lang="ts">
	// Component
	import { Helper, Input, Label } from 'flowbite-svelte';
	// Interfaces
	interface ITextInputProps {
		id: string;
		label: string;
		name: string;
		placeholder: string;
		required?: boolean;
		textError?: string;
	}

	const { id, label, name, placeholder, required = false, textError } = $props<ITextInputProps>();
</script>

<Label color={textError ? 'red' : undefined} class="space-y-2" for={id}>
	<span>{label}</span>

	<Input color={textError ? 'red' : undefined} type="text" {id} {name} {placeholder} {required} />

	{#if textError}
		<Helper class="mt-2" color="red">
			{textError}
		</Helper>
	{/if}
</Label>
