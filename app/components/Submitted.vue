<template>
    <Page actionBarHidden="true" style="margin: 5px;">
        <GridLayout rows="*, auto, auto, auto, *">
          <Label row="1" fontWeight="bold" text="Tack!"/>
          <Label row="2" textWrap="true" text="Genom att skänka din pant hjälper du föreningslivet och skolor i din närhet att skapa bra förutsättningar för ett välmående samhälle."/>
          <Button row="3" @onTap="onContinueTap" horizontalAlignment="center" text="Vidare"/>
        </GridLayout>
    </Page>
</template>

<script>
  import App from './App'

  export default {
    data() {
      return {
      }
    },
    methods: {
      onContinueTap() {
        this.$navigateTo(App);
      }
    }
  }
</script>

<style scoped>
</style>
