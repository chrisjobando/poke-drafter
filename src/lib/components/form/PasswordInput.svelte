<script lang="ts">
	// Interface
	interface IPasswordInputProps {
		label: string;
		name: string;
		required: boolean;
		errorMessage?: string;
	}

	const { label, name, required = false, errorMessage } = $props<IPasswordInputProps>();
</script>

<label class="label-text font-bold" for="email"
	>{label}
	{#if required}
		<span class="text-red-500">*</span>
	{/if}
</label>

<input
	autocomplete="password"
	class="input input-bordered"
	placeholder="pikachulover123!"
	type="password"
	{name}
/>

{#if errorMessage}
	<p class="mt-1 pl-2 text-sm font-bold text-red-500">{errorMessage}</p>
{:else}
	<div class="mt-1 h-5 w-full" />
{/if}
