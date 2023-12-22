<script lang="ts">
	// Interface
	interface IEmailInputProps {
		required: boolean;
		errorMessage?: string;
	}

	const { required = false, errorMessage } = $props<IEmailInputProps>();
</script>

<label class="label-text font-bold" for="email"
	>Email
	{#if required}
		<span class="text-red-500">*</span>
	{/if}
</label>

<input
	autocomplete="email"
	class="input input-bordered"
	name="email"
	placeholder="ash@example.com"
	type="email"
/>

{#if errorMessage}
	<p class="mt-1 pl-2 text-sm font-bold text-red-500">{errorMessage}</p>
{:else}
	<div class="mt-1 h-5 w-full" />
{/if}
