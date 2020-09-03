<template>
    <Page actionBarHidden="true" style="margin: 5px;">
        <ScrollView>
            <GridLayout rows="auto, *, auto, *, auto, *, auto, *, auto, *, auto, *, auto">
                <Label row="0" text="Information" fontWeight="bold" horizontalAlignment="center"/>
                <StackLayout row="2">
                    <Label text="Bor du i villa eller lägenhet?" fontWeight="bold" horizontalAlignment="center"/>
                    <SegmentedBar selectedIndex="0" v-model="selectedPropertyType">
                        <SegmentedBarItem title="Villa" />
                        <SegmentedBarItem title="Lägenhet" />
                    </SegmentedBar>
                </StackLayout>
                <StackLayout row="4">
                    <Label text="När kan vi komma och hämta?" fontWeight="bold" horizontalAlignment="center"/>
                    <SegmentedBar>
                        <SegmentedBarItem title="12h" />
                        <SegmentedBarItem title="24h" />
                        <SegmentedBarItem title="48h" />
                        <SegmentedBarItem title="72h" />
                    </SegmentedBar>
                </StackLayout>
                <StackLayout row="6">
                    <Label text="Panthämtare" horizontalAlignment="center" fontWeight="bold"/>
                    <DropDown :items="pantRetrievers"/>
                </StackLayout>
                <StackLayout row="8" v-if="selectedPropertyType == 1">
                    <Label textWrap="true" text="Vilken trappuppgång och våning kommer du ställa ut panten?" fontWeight="bold" horizontalAlignment="center"/>
                    <TextField hint="våning/trappuppgång"/>
                </StackLayout>
                <StackLayout row="10">
                    <Label text="Övrig information?" fontWeight="bold" horizontalAlignment="center"/>
                    <TextView />
                </StackLayout>
                <StackLayout row="12" horizontalAlignment="center">
                    <Button @onTap="onBookTap" text="Boka hämtning"/>
                    <Button @onTap="onChangeLocationTap" text="Ändra plats"/>
                    <Button @onTap="onCancelTap" text="Avbryt"/>
                </StackLayout>
            </GridLayout>
        </ScrollView>
    </Page>
</template>

<script>
  import Submitted from './Submitted'
  import PlaceMarker from './PlaceMarker'

  export default {
    data() {
      return {
        pantRetrievers: ["Alla tillgängliga", "Gävle Ridklubb 1km"],
        selectedPropertyType: 0
      }
    },
    methods: {
        onBookTap() {
            this.$navigateTo(Submitted);
        },
        onChangeLocationTap() {
            this.$navigateTo(PlaceMarker);
        },
        onCancelTap() {

        }
    }
  }
</script>

<style scoped>
    
</style>
