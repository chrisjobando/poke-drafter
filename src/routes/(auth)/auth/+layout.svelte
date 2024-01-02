<script lang="ts">
	import { Card } from 'flowbite-svelte';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<Card class="m-auto w-full max-w-lg">
		<slot />
	</Card>
</div>
