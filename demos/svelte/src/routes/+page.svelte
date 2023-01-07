<script>
	import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.svelte';
</script>

<svelte:head>
	<title>ScrollyVideo Svelte Demo</title>
</svelte:head>

<div class="scrolly-video-container">
	<ScrollyVideo src="https://scrollyvideo.js.org/goldengate.mp4" />
</div>

<style>
	.scrolly-video-container {
		height: 300vh;
	}
</style>
