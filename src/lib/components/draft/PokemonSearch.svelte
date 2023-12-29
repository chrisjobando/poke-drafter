<script lang="ts">
	// Data
	import pokemonNames from '$lib/names.json';

	interface IDebouncedSearchBarProps {
		filteredNames: string[];
		name: string;
		placeholder: string;
		searchQuery: string;
		formRef?: HTMLFormElement;
	}

	let { filteredNames, name, placeholder, searchQuery, formRef } =
		$props<IDebouncedSearchBarProps>();

	// Methods
	function onSelectAutoComplete(pokemonName: string) {
		// Reset Search Results
		filteredNames = [];

		// Set Selected
		searchQuery = pokemonName;

		// Get Pokemon Data
		if (formRef) {
			formRef.requestSubmit();
		}
	}

	function onSearchInputKeyup(event: Event) {
		const inputEl = event.target as HTMLInputElement;
		const inputVal = inputEl.value;
		searchQuery = inputVal;
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

<div>
	<input
		autocomplete="off"
		type="text"
		value={searchQuery}
		{name}
		{placeholder}
		on:keyup={onDebounceSearch}
	/>

	{#if filteredNames.length}
		<ul>
			{#each filteredNames as name}
				<li>
					<button on:click={() => onSelectAutoComplete(name)}>{name}</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
