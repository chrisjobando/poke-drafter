<script>
	import { page } from '$app/stores';

	import { A, Heading } from 'flowbite-svelte';
</script>

<div class="m-auto">
	<Heading tag="h3">{$page.status}: {$page.error?.message}</Heading>
	<A color="text-xl text-primary-700 dark:text-primary-500" href="/">Go to Home</A>
</div>
