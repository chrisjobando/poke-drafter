<script lang="ts">
	import { enhance } from '$app/forms';
	// Components
	import { Input, Listgroup } from 'flowbite-svelte';
	// Data
	import pokemonNames from '$lib/names.json';

	interface IPokemonSearchProps {
		pokemonSelection: {
			selectedPokemon: string;
		};
	}

	let { pokemonSelection } = $props<IPokemonSearchProps>();

	let filteredNames = $state<string[]>([]);
	let formRef = $state<HTMLFormElement | null>(null);

	// Methods
	function onSelectAutoComplete(pokemonName: string) {
		// Reset Search Results
		filteredNames = [];

		// Set Selected
		pokemonSelection.selectedPokemon = pokemonName;

		// Get Pokemon Data
		if (formRef) {
			formRef.requestSubmit();
		}
	}

	function onSearchInputKeyup(event: Event) {
		const inputEl = event.target as HTMLInputElement;
		const inputVal = inputEl.value;
		pokemonSelection.selectedPokemon = inputVal;
		filteredNames = filterNamesFromSearchQuery(inputVal);
	}

	function filterNamesFromSearchQuery(query: string) {
		if (query.length < 3) return [];
		const lowerSearchQuery = query.toLowerCase();

		const filteredNames = pokemonNames.filter(
			(pokemonName) => pokemonName.toLowerCase().indexOf(lowerSearchQuery) === 0
		);
		return filteredNames.slice(0, 6);
	}

	// Debounce Logic
	let debounceTimer: number;

	function onDebounceSearch(searchEvent: Event) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearchInputKeyup(searchEvent);
		}, 300);
	}
</script>

<form
	action="?/previewPokemon"
	method="post"
	bind:this={formRef}
	use:enhance={({ formData }) => {
		formData.set('pokemon_name', pokemonSelection.selectedPokemon);

		return async ({ update }) => {
			// Prevent clearing form inputs on submit
			await update({ reset: false });
		};
	}}
>
	<Input
		autocomplete="off"
		class="w-full"
		id="pokemon_search"
		name="pokemon_search"
		placeholder="Search for Pokemon"
		type="text"
		value={pokemonSelection.selectedPokemon}
		on:keyup={onDebounceSearch}
	/>

	{#if filteredNames.length}
		<Listgroup active items={filteredNames} let:item class="mt-1 w-48">
			<button class="h-full w-full text-left" on:click={() => onSelectAutoComplete(item)}>
				{item}
			</button>
		</Listgroup>
	{/if}
</form>
