<script lang="ts">
	import type { ITrainer } from '$lib/db/schema/DatabaseTypes';
	import { Heading } from 'flowbite-svelte';
	import { OtherTrainerDisplay } from '../trainers';

	const mockTrainerData: ITrainer = {
		auth_id: '1234',
		display_name: 'John Doe',
		id: '1',
		role: 'trainer'
	};

	const mockTrainerData2: ITrainer = {
		auth_id: '5678',
		display_name: 'Jane Doe',
		id: '2',
		role: 'trainer'
	};

	const mockTrainerData3: ITrainer = {
		auth_id: '91011',
		display_name: 'John Smith',
		id: '3',
		role: 'trainer'
	};

	const mockTrainerData4: ITrainer = {
		auth_id: '121314',
		display_name: 'Jane Smith',
		id: '4',
		role: 'trainer'
	};

	const mockTrainerData5: ITrainer = {
		auth_id: '151617',
		display_name: 'Taco Bell',
		id: '5',
		role: 'trainer'
	};
</script>

<div class="col-span-2 h-full border-r border-black py-8">
	<Heading class="mb-8 ml-4" tag="h3">Round 1</Heading>

	<OtherTrainerDisplay trainerData={mockTrainerData} />
	<OtherTrainerDisplay trainerData={mockTrainerData2} />
	<OtherTrainerDisplay trainerData={mockTrainerData3} />
	<OtherTrainerDisplay trainerData={mockTrainerData4} />
	<OtherTrainerDisplay trainerData={mockTrainerData5} />
</div>
