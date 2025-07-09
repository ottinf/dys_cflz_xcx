<template>
	<view>
		<web-view :webview-styles="webviewStyles"
			src="https://mm.d1she.cn/oprmobile/video?Id=1843&OpenID=47e46c09740030bf2111762ae10d6866"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			webviewStyles: {
				progress: { color: '#FF3333' },
			},
		}
	}
}
</script>

<style></style>