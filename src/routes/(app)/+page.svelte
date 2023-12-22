<script lang="ts">
	// Components
	import DebouncedSearchBar from '$lib/components/DebouncedSearchBar.svelte';

	// Data
	import pokemonNames from '$lib/names.json';

	// State
	let searchQuery = $state<string>('');
	let filteredNames = $state<string[]>([]);

	let selectedPokemon = $state<string>('');

	// Functions
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

	function onSelectAutoComplete(pokemonName: string) {
		// Reset Search Bar
		searchQuery = '';
		filteredNames = [];

		// Set Selected
		selectedPokemon = pokemonName;
	}
</script>

<svelte:head>
	<title>Draft Tool</title>
</svelte:head>

<a class="mb-5 text-primary" href="/auth/signin">Go to sign-in</a>

<h1 class="text-2xl">Draft Tool</h1>

<div class="mt-4 flex h-[400px] items-center justify-center">
	{#if selectedPokemon.length}
		<div class="flex w-72 flex-col">
			<div class="h-64 w-64 self-center rounded bg-neutral" />

			<h3 class="my-2 text-center text-lg font-bold">{selectedPokemon}</h3>

			<p>Type(s): <span class="font-bold">Fire</span></p>
			<p>Weakness(es): <span class="font-bold">Water</span></p>
		</div>
	{/if}
</div>

<div class="dropdown dropdown-bottom mt-2 w-full">
	<DebouncedSearchBar placeholder="Enter name here" {searchQuery} {onSearchInputKeyup} />

	{#if filteredNames.length}
		<ul class="menu dropdown-content z-[1] w-52 rounded-box bg-base-200 p-2 shadow">
			{#each filteredNames as name}
				<li>
					<button
						class="w-full rounded p-2 text-left hover:bg-neutral"
						on:click={() => onSelectAutoComplete(name)}>{name}</button
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<button class="btn btn-primary mt-2">Submit</button>
