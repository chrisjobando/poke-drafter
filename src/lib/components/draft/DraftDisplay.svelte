<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	import { OtherTrainerDisplay } from '../trainers';
	// Interfaces
	import type { IDraft, IOtherTrainer } from '$lib/db/schema/DatabaseTypes';

	interface IDraftDisplayProps {
		draftData: Pick<IDraft, 'round_number'>;
		otherTrainerData?: IOtherTrainer[];
	}

	// Props
	const { draftData, otherTrainerData } = $props<IDraftDisplayProps>();
</script>

<div class="col-span-2 h-full border-r border-black py-8">
	<Heading class="mb-8 ml-4" tag="h3">Round {draftData.round_number}</Heading>

	{#if otherTrainerData && otherTrainerData.length}
		{#each otherTrainerData as trainerData}
			<OtherTrainerDisplay {trainerData} />
		{/each}
	{:else}
		<P class="text-bold ml-4">No other trainers</P>
	{/if}
</div>
