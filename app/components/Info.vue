<template>
    <Page actionBarHidden="true" style="margin: 5px;">
        <GridLayout rows="auto, *" marginLeft="15">
            <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
            <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
            <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
            <StackLayout row="1" marginTop="18">
                <Label text="Välkommen!" fontWeight="bold" fontSize="23" class="primaryTextColor" />
            </StackLayout>
        </GridLayout>
        <!--<ScrollView>
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
        </ScrollView>-->
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
        timeFrames: [12, 24, 48, 72]
      }
    },
    methods: {
        roundToHour(date) {
            const hourMs = 60 * 60 * 1000;
            return new Date(Math.ceil(date.getTime() / hourMs) * hourMs);
        },
        dateToString(date) {
            const str = `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            return str;
        },
        async onBookTap() {
            const coords = this.$store.state.selectedCoordinates;
            const start = this.roundToHour(new Date());
            const end = this.roundToHour(new Date());
            const hours = this.timeFrames[this.selectedTimeFrame];
            end.setTime(end.getTime() + (hours*60*60*1000));

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
                            "start": this.dateToString(start),
                            "end": this.dateToString(end),
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
