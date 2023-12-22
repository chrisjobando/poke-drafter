<script lang="ts">
	interface IDebouncedSearchBarProps {
		placeholder: string;
		searchQuery: string;
		onSearchInputKeyup: (event: Event) => void;
	}

	let { placeholder, searchQuery, onSearchInputKeyup } = $props<IDebouncedSearchBarProps>();

	let debounceTimer: number;

	function onDebounceSearch(searchEvent: Event) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onSearchInputKeyup(searchEvent);
		}, 300);
	}
</script>

<input
	class="input input-bordered w-full"
	type="text"
	value={searchQuery}
	{placeholder}
	on:keyup={onDebounceSearch}
/>
