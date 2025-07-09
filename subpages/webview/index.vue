<template>
  <web-view :webview-styles="webviewStyles" :src="url"></web-view>
</template>

<script>
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#FF3333'
        },
      },
      url: '',

    }
  },
  onLoad(options) {
    this.url = decodeURIComponent(options.url);
    console.log(this.url)
  }
}
</script>

<style></style>