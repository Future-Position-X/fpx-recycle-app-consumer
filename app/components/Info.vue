<template>
    <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
        <GridLayout>
            <ScrollView>
                <GridLayout rows="auto, *, auto" padding="0 20">
                    <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
                    <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
                    <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
                    <StackLayout row="1" marginTop="18">
                        <Label text="Inställningar" fontWeight="bold" fontSize="23" class="titleColor" />
                        <Label text="Hur bor du?" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22" />
                        <SegmentedBar selectedIndex="0" v-model="selectedPropertyType" background="#e3e3e4" selectedBackgroundColor="white" borderRadius="10" height="35" marginTop="10">
                            <SegmentedBarItem title="Villa" />
                            <SegmentedBarItem title="Lägenhet" />
                        </SegmentedBar>
                        <Label text="Inom vilken tidsram kan vi hämta panten?" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22" />
                        <SegmentedBar selectedIndex="3" background="#e3e3e4" selectedBackgroundColor="white" borderRadius="10" height="35" marginTop="10">
                            <SegmentedBarItem title="12h" />
                            <SegmentedBarItem title="24h" />
                            <SegmentedBarItem title="48h" />
                            <SegmentedBarItem title="72h" />
                        </SegmentedBar>
                        <Label row=0 text="Storlek på panten" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22" />
                        <GridLayout rows="auto, auto" columns="*, *, *" marginTop="10">
                            <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="0" src="~/assets/images/icon_small_load@3x.png"/>
                            <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="1" marginRight="25" src="~/assets/images/icon_small_load@3x.png"/>
                            <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="1" marginLeft="25" src="~/assets/images/icon_small_load@3x.png"/>
                            <Image stretch="none" horizontalAlignment="center" row="0" column="2" src="~/assets/images/icon_big_load@3x.png"/>
                            <SegmentedBar row="1" column="0" columnSpan="7" selectedIndex="0" v-model="selectedTimeFrame" background="#e3e3e4" selectedBackgroundColor="white" borderRadius="10" height="35" marginTop="10">
                                <SegmentedBarItem title="Liten" />
                                <SegmentedBarItem title="Mellan" />
                                <SegmentedBarItem title="Stor" />
                            </SegmentedBar>
                        </GridLayout>
                        <Label text="Panthämtare" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22" />
                        <GridLayout paddingLeft="15" marginTop="10" background="white" height="50" borderRadius="30" borderWidth="1" borderColor="#e7e7e8">
                            <DropDown style="font-size: 18px;" ref="pantRetrieversDropDown" :items="pantRetrievers" selectedIndex="selectedPantRetriever" itemsPadding="20" itemsTextAlignment="center" verticalAlignment="middle"/>
                        </GridLayout>
                        <Label text="Vilken trappa och våning?" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22" />
                        <TextView marginTop="10" background="white" height="55" borderRadius="30" borderWidth="1" borderColor="#e7e7e8"/>
                        <Label text="Övrig information" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22" />
                        <TextView marginTop="10" background="white" height="55" borderRadius="30" borderWidth="1" borderColor="#e7e7e8"/>
                        <Button row="2" @onTap="onBookTap" text="Boka hämtning" verticalAlignment="bottom" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="60%" height="57" fontSize="21" marginTop="40"/>
                        <Button row="2" @onTap="onChangeLocationTap" text="Byt plats" verticalAlignment="bottom" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21" marginTop="5" marginBottom="50"/>
                    </StackLayout>
                </GridLayout>
            </ScrollView>
            <GridLayout v-if="showThankYou" borderRadius="20" verticalAlignment="center" horizontalAlignment="center" background="white" androidElevation="12" margin="30" padding="30">
                <StackLayout>
                <Image src="~/assets/images/icon_heart@3x.png" stretch="none" horizontalAlignment="center" />
                <Label text="Tack!" fontWeight="bold" fontSize="37" class="titleColor" horizontalAlignment="center" marginTop="10" />
                <Label text="Genom att skänka pant så hjälper du skolor och föreningsliv i ditt närområde att skapa bra förutsättningar för ett välmående samhälle" marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
                <Button @onTap="onContinue" text="Fortsätt" verticalAlignment="bottom" marginTop="39" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21" class="bodyTextColor"/>
                </StackLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script>
  import PlaceMarker from './PlaceMarker'
  import session from '../services/session'
  import collection from '../services/collection'
  import App from './App'
 
  export default {
    data() {
      return {
        selectedPropertyType: 0,
        selectedTimeFrame: 4,
        pantRetrievers: [],
        selectedPantRetriever: 0,
        floorInfo: null,
        otherInfo: null,
        showThankYou: false,

        propertyTypes: ["Villa", "Lägenhet"],
        timeFrames: [12, 24, 48, 72]
      }
    },
    methods: {
        onPageLoaded() {
            this.pantRetrievers.push("Alla tillgängliga");

            for (const collector of this.$store.state.availableCollectors) {
                this.pantRetrievers.push(collector.properties.name);
            }
        },
        onContinue() {
            this.$navigateTo(App);
        },
        async onBookTap() {
            const coords = this.$store.state.selectedCoordinates;
            const start = new Date();
            const end = new Date();
            const hours = this.timeFrames[this.selectedTimeFrame];
            end.setTime(end.getTime() + (hours*60*60*1000));

            const item = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [coords.lng, coords.lat]
                },
                "properties": {
                    "property_type": this.propertyTypes[this.selectedPropertyType],
                    "start": start.toISOString(),
                    "end": end.toISOString(),
                    "retriever": this.pantRetrievers[this.$refs.pantRetrieversDropDown.nativeView.selectedIndex],
                    "floor_info": this.floorInfo,
                    "other_info": this.otherInfo,
                    "status": "waiting"
                }
            };

            console.log("creating session");
            await session.create("recycleconsumer@gia.fpx.se", "test");
            console.log(session.token);
            
            console.log("fetching collections by name");
            const collections = await collection.fetchCollections();
            console.log("collections: " + JSON.stringify(collections));

            let recycleCollection = collections.find(c => c.name == "fpx_recycle_consumer" && c.provider_uuid == session.user.provider_uuid);
            console.log("recycleCollection: " + JSON.stringify(recycleCollection));

            if (recycleCollection == null) {
                console.log("creating new collection");
                recycleCollection = await collection.create("fpx_recycle_consumer", false);
                console.log("created collection: " + JSON.stringify(recycleCollection));
            }

            console.log("adding item to collection");
            console.log("item:" + JSON.stringify(item))
            await collection.createItem(recycleCollection.uuid, item);

            this.showThankYou = true;
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
