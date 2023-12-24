<script lang="ts">
	// Interface
	interface ITextInputProps {
		label: string;
		name: string;
		placeholder: string;
		required: boolean;
		autocomplete?: string;
		errorMessage?: string;
	}

	const {
		label,
		name,
		placeholder,
		required = false,
		autocomplete,
		errorMessage
	} = $props<ITextInputProps>();
</script>

<label class="label-text font-bold" for={name}
	>{label}
	{#if required}
		<span class="text-red-500">*</span>
	{/if}
</label>

<input class="input input-bordered" type="text" {autocomplete} {name} {placeholder} />

{#if errorMessage}
	<p class="mt-1 pl-2 text-sm font-bold text-red-500">{errorMessage}</p>
{:else}
	<div class="mt-1 h-5 w-full" />
{/if}
