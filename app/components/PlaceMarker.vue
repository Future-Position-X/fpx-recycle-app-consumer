<template>
    <Page actionBarHidden="true">
        <GridLayout columns="*" rows="*, auto">
            <Image row="0" src="res://map" stretch="none"/>
            <Button row="0" @onTap="onRetrievePositionTap" text="Hämta min position" horizontalAlignment="right" verticalAlignment="top"/>
            <StackLayout row="1" style="margin: 5px;">
              <Label textWrap="true" text="Placera markören där panten kan hämtas."/>
              <Label textWrap="true" text="Försök vara så exakt som möjligt, för att underlätta och snabba på upphämtningen."/>
              <Label textWrap="true" text="Särskilt viktigt är det att platsen du väljer är lätt att nå från allmän väg, och att den som hämtar din pant har tillåtelse att beträda området."/>
              <Button @onTap="onSaveTap" text="Spara" horizontalAlignment="center"/>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
  import Info from './Info'
  export default {
    data() {
      return {
        
      }
    },
    methods: {
        onSaveTap() {
            this.$navigateTo(Info);
        },
        onRetrievePositionTap() {

        }
    }
  }
</script>

<style scoped>
</style>
