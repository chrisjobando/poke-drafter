<script lang="ts">
	import { enhance } from '$app/forms';
	// Components
	import { Listgroup, Search } from 'flowbite-svelte';
	// Interfaces
	import type { IPokemonSelection } from '../store/pokemonSelectionStore.svelte';
	// Data
	import pokemonNames from '$lib/names.json';

	interface IPokemonSearchProps {
		pokemonSelection: Pick<IPokemonSelection, 'pokemonName'>;
	}

	let { pokemonSelection } = $props<IPokemonSearchProps>();

	let filteredNames = $state<string[]>([]);
	let formRef = $state<HTMLFormElement | null>(null);

	// Methods
	function onSelectAutoComplete(pokemonName: string) {
		// Reset Search Results
		filteredNames = [];

		// Set Selected
		pokemonSelection.pokemonName = pokemonName;

		// Get Pokemon Data
		if (formRef) {
			formRef.requestSubmit();
		}
	}

	function onSearchInputKeyup(event: Event) {
		const inputEl = event.target as HTMLInputElement;
		const inputVal = inputEl.value;
		pokemonSelection.pokemonName = inputVal;
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
	method="POST"
	bind:this={formRef}
	use:enhance={({ formData }) => {
		formData.set('pokemon_name', pokemonSelection.pokemonName);

		return async ({ update }) => {
			// Prevent clearing form inputs on submit
			await update({ reset: false });
		};
	}}
>
	<Search
		autocomplete="off"
		class="w-full"
		id="pokemon_search"
		name="pokemon_search"
		placeholder="Search for Pokemon"
		type="text"
		value={pokemonSelection.pokemonName}
		on:keyup={onDebounceSearch}
	/>

	{#if filteredNames.length}
		<Listgroup active class="absolute z-10 mt-1 w-48" items={filteredNames} let:item>
			<button class="h-full w-full text-left" on:click={() => onSelectAutoComplete(item)}>
				{item}
			</button>
		</Listgroup>
	{/if}
</form>
