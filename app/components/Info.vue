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
                    <SegmentedBar selectedIndex="0" v-model="selectedTimeFrame">
                        <SegmentedBarItem title="12h" />
                        <SegmentedBarItem title="24h" />
                        <SegmentedBarItem title="48h" />
                        <SegmentedBarItem title="72h" />
                    </SegmentedBar>
                </StackLayout>
                <StackLayout row="6">
                    <Label text="Panthämtare" horizontalAlignment="center" fontWeight="bold"/>
                    <DropDown ref="pantRetrieversDropDown" :items="pantRetrievers" selectedIndex="selectedPantRetriever"/>
                </StackLayout>
                <StackLayout row="8" v-if="selectedPropertyType == 1">
                    <Label textWrap="true" text="Vilken trappuppgång och våning kommer du ställa ut panten?" fontWeight="bold" horizontalAlignment="center"/>
                    <TextField hint="våning/trappuppgång" v-model="floorInfo"/>
                </StackLayout>
                <StackLayout row="10">
                    <Label text="Övrig information?" fontWeight="bold" horizontalAlignment="center"/>
                    <TextView v-model="otherInfo"/>
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
  import session from '../services/session'
  import collection from '../services/collection'
 
  export default {
    data() {
      return {
        selectedPropertyType: 0,
        selectedTimeFrame: 0,
        pantRetrievers: ["Alla tillgängliga", "Gävle Ridklubb 1km"],
        selectedPantRetriever: 0,
        floorInfo: null,
        otherInfo: null,

        propertyTypes: ["Villa", "Lägenhet"],
        timeFrames: ["12h", "24h", "48h", "72h"]
      }
    },
    methods: {
        async onBookTap() {
            const coords = this.$store.state.selectedCoordinates;

            const items = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [coords.lng, coords.lat]
                        },
                        "properties": {
                            "property_type": this.propertyTypes[this.selectedPropertyType],
                            "time_frame": this.timeFrames[this.selectedTimeFrame],
                            "retriever": this.pantRetrievers[this.$refs.pantRetrieversDropDown.nativeView.selectedIndex],
                            "floor_info": this.floorInfo,
                            "other_info": this.otherInfo
                        }
                    }
                ]
            };

            console.log("creating session");
            await session.create("recycleconsumer@gia.fpx.se", "test");
            console.log(session.token);
            
            console.log("fetching collections by name");
            const collections = await collection.fetchCollections();
            console.log("collections: " + collections);

            let recycleCollection = collections.find(c => c.name == "fpx_recycle_consumer" && c.provider_uuid == session.user.provider_uuid);
            console.log("recycleCollection: " + recycleCollection);

            if (recycleCollection == null) {
                console.log("creating new collection");
                recycleCollection = await collection.create("fpx_recycle_consumer", false);
                console.log("created collection: " + recycleCollection);
            }

            console.log("adding item to collection");
            await collection.addItems(recycleCollection.uuid, items);

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
