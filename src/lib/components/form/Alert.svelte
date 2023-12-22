<script lang="ts">
	// Interfaces
	interface IAlertProps {
		message: string;
		type?: IAlertType;
		time?: number;
		onDestroyCallback?: () => void;
	}

	type IAlertType = 'success' | 'info' | 'warning';

	const themeColors: { [key in IAlertType]: string } = {
		success: 'bg-success',
		info: 'bg-info',
		warning: 'bg-warning'
	};

	// Props
	const {
		message = '',
		type = 'success',
		time = 3000,
		onDestroyCallback = () => {}
	} = $props<IAlertProps>();

	const bgColor = themeColors[type];

	// Destroy after [time] milliseconds
	setTimeout(() => {
		onDestroyCallback();
	}, time);
</script>

<div class="flex items-center justify-center rounded p-3 {bgColor}">
	<p><span>{message}</span></p>
</div>
