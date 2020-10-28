<template>
  <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
    <GridLayout>
      <ScrollView>
        <GridLayout rows="auto, *, auto" padding="0 20">
          <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left"
                 verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
          <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center"
                 verticalAlignment="top" width="150" height="35" marginTop="25"/>
          <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right"
                 verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
          <StackLayout row="1" marginTop="18">
            <Label text="Inställningar" fontWeight="bold" fontSize="23" class="titleColor"/>
            <Label text="Hur bor du?" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22"/>
            <GridLayout rows="auto, auto" columns="*, *" marginTop="10">
              <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="0"
                     :src="selectedPropertyType === 0 ? '~/assets/images/ico_villa_selected@3x.png' : '~/assets/images/ico_villa_default@3x.png'"
                     @onTap="() => this.selectedPropertyType = 0"/>
              <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="1"
                     :src="selectedPropertyType === 1 ? '~/assets/images/ico_appartment_selected@3x.png' : '~/assets/images/ico_appartment_default@3x.png'"
                     @onTap="() => this.selectedPropertyType = 1"/>
              <SegmentedBar row="1" column="0" columnSpan="2" v-model="selectedPropertyType" background="#e3e3e4"
                            selectedBackgroundColor="white" borderRadius="10" height="35" marginTop="10">
                <SegmentedBarItem title="Villa"/>
                <SegmentedBarItem title="Lägenhet"/>
              </SegmentedBar>
            </GridLayout>
            <Label text="Inom vilken tidsram kan vi hämta panten?" fontWeight="bold" fontSize="18" class="titleColor"
                   marginTop="22"/>
            <GridLayout rows="auto, auto" columns="*, *, *, *" marginTop="10">
              <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="0"
                     :src="selectedTimeFrame === 0 ? '~/assets/images/ico_12h_selected@3x.png' : '~/assets/images/ico_12h_default@3x.png'"
                     @onTap="() => this.selectedTimeFrame = 0"/>
              <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="1"
                     :src="selectedTimeFrame === 1 ? '~/assets/images/ico_24h_selected@3x.png' : '~/assets/images/ico_24h_default@3x.png'"
                     @onTap="() => this.selectedTimeFrame = 1"/>
              <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="2"
                     :src="selectedTimeFrame === 2 ? '~/assets/images/ico_48h_selected@3x.png' : '~/assets/images/ico_48h_default@3x.png'"
                     @onTap="() => this.selectedTimeFrame = 2"/>
              <Image stretch="none" horizontalAlignment="center" row="0" column="3"
                     :src="selectedTimeFrame === 3 ? '~/assets/images/ico_72h_selected@3x.png' : '~/assets/images/ico_72h_default@3x.png'"
                     @onTap="() => this.selectedTimeFrame = 3"/>
              <SegmentedBar row="1" column="0" columnSpan="4" v-model="selectedTimeFrame" background="#e3e3e4"
                            selectedBackgroundColor="white" borderRadius="10"
                            height="35" marginTop="10">
                <SegmentedBarItem title="12h"/>
                <SegmentedBarItem title="24h"/>
                <SegmentedBarItem title="48h"/>
                <SegmentedBarItem title="72h"/>
              </SegmentedBar>
            </GridLayout>
            <Label row=0 text="Storlek på panten" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22"/>
            <GridLayout rows="auto, auto" columns="*, *, *" marginTop="10">
              <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="0"
                     :src="selectedPantSize === 0 ? '~/assets/images/ico_pant_small_selected@3x.png' : '~/assets/images/ico_pant_small_default@3x.png'"
                     @onTap="() => this.selectedPantSize = 0"/>
              <Image stretch="none" horizontalAlignment="center" verticalAlignment="bottom" row="0" column="1"
                     :src="selectedPantSize === 1 ? '~/assets/images/ico_pant_mid_selected@3x.png' : '~/assets/images/ico_pant_mid_default@3x.png'"
                     @onTap="() => this.selectedPantSize = 1"/>
              <Image stretch="none" horizontalAlignment="center" row="0" column="2"
                     :src="selectedPantSize === 2 ? '~/assets/images/ico_pant_big_selected@3x.png' : '~/assets/images/ico_pant_big_default@3x.png'"
                     @onTap="() => this.selectedPantSize = 2"/>
              <SegmentedBar row="1" column="0" columnSpan="3" v-model="selectedPantSize"
                            background="#e3e3e4" selectedBackgroundColor="white" borderRadius="10" height="35"
                            marginTop="10">
                <SegmentedBarItem title="Liten"/>
                <SegmentedBarItem title="Mellan"/>
                <SegmentedBarItem title="Stor"/>
              </SegmentedBar>
            </GridLayout>
            <Label text="Panthämtare" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22"/>
            <GridLayout paddingLeft="15" marginTop="10" background="white" height="50" borderRadius="30" borderWidth="1"
                        borderColor="#e7e7e8">
              <DropDown style="font-size: 18px;" ref="pantRetrieversDropDown" :items="pantRetrievers" itemsPadding="20"
                        itemsTextAlignment="center"
                        verticalAlignment="middle"/>
            </GridLayout>
            <Label v-if="selectedPropertyType == 1" text="Vilken trappa och våning?" fontWeight="bold" fontSize="18"
                   class="titleColor" marginTop="22"/>
            <TextView v-if="selectedPropertyType == 1" marginTop="10" background="white" height="55" borderRadius="30"
                      borderWidth="1"
                      borderColor="#e7e7e8"/>
            <Label text="Övrig information" fontWeight="bold" fontSize="18" class="titleColor" marginTop="22"/>
            <TextView marginTop="10" background="white" height="55" borderRadius="30" borderWidth="1"
                      borderColor="#e7e7e8"/>
            <Button row="2" @onTap="onBookTap" text="Boka hämtning" verticalAlignment="bottom" textTransform="none"
                    background="#0aa67a" color="white" borderRadius="40" width="60%" height="57" fontSize="21"
                    marginTop="40"/>
            <Button row="2" @onTap="onChangeLocationTap" text="Byt plats" verticalAlignment="bottom"
                    textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57"
                    fontSize="21" marginTop="5" marginBottom="50"/>
          </StackLayout>
        </GridLayout>
      </ScrollView>
      <GridLayout v-if="showThankYou" borderRadius="20" verticalAlignment="center" horizontalAlignment="center"
                  background="white" androidElevation="12" margin="30" padding="30">
        <StackLayout>
          <Image src="~/assets/images/icon_heart@3x.png" stretch="none" horizontalAlignment="center"/>
          <Label text="Tack!" fontWeight="bold" fontSize="37" class="titleColor" horizontalAlignment="center"
                 marginTop="10"/>
          <Label
              text="Genom att skänka pant så hjälper du skolor och föreningsliv i ditt närområde att skapa bra förutsättningar för ett välmående samhälle"
              marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor"/>
          <Button @onTap="onContinue" text="Fortsätt" verticalAlignment="bottom" marginTop="39" textTransform="none"
                  background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21"
                  class="bodyTextColor"/>
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
import config from "../config";
import {Booking, BookingStatus, PropertyType} from "../models";

const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
export default {
  data() {
    return {
      selectedPropertyType: 0,
      selectedTimeFrame: 3,
      selectedPantSize: 1,
      pantRetrievers: new ObservableArray(),
      floorInfo: null,
      otherInfo: null,
      showThankYou: false,

      propertyTypes: [PropertyType.HOUSE, PropertyType.APARTMENT],
      timeFrames: [12, 24, 48, 72]
    }
  },
  methods: {
    onPageLoaded() {
      this.pantRetrievers.push("Alla tillgängliga");
      for (const availableRetriever of this.$store.state.availableRetrievers) {
        this.pantRetrievers.push(availableRetriever.name);
      }
      this.$refs.pantRetrieversDropDown.nativeView.selectedIndex = 0;
    },
    onContinue() {
      this.$navigateTo(App);
    },
    async onBookTap() {
      const coords = this.$store.state.selectedCoordinates;
      const start = new Date();
      const end = new Date();
      const hours = this.timeFrames[this.selectedTimeFrame];
      end.setTime(end.getTime() + (hours * 60 * 60 * 1000));

      const booking = new Booking();
      booking.coordinates = [coords.lng, coords.lat];
      booking.property_type = this.propertyTypes[this.selectedPropertyType];
      booking.start = start.toISOString()
      booking.end = end.toISOString()
      let retriever_uuid;
      if (this.$refs.pantRetrieversDropDown.nativeView.selectedIndex === 0) {
        retriever_uuid = "00000000-0000-0000-0000-000000000000";
      } else {
        retriever_uuid = this.$store.state.availableRetrievers[this.$refs.pantRetrieversDropDown.nativeView.selectedIndex - 1].uuid
      }
      booking.retriever_uuid = retriever_uuid;
      booking.floor_info = this.floorInfo
      booking.other_info = this.otherInfo
      booking.status = BookingStatus.WAITING;

      console.log("creating session");
      await session.create("recycleconsumer@gia.fpx.se", "test");
      console.log(session.token);

      console.log("fetching collections by name");
      const collections = await collection.fetchCollections();
      console.log("collections: " + JSON.stringify(collections));

      let recycleCollection = collections.find(c => c.name === config.BOOKING_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);
      console.log("recycleCollection: " + JSON.stringify(recycleCollection));

      if (recycleCollection == null) {
        console.log("creating new collection");
        recycleCollection = await collection.create(config.BOOKING_COLLECTION_NAME, false);
        console.log("created collection: " + JSON.stringify(recycleCollection));
      }

      console.log("adding item to collection");
      console.log("item:" + JSON.stringify(booking.to_item()))
      await collection.createItem(recycleCollection.uuid, booking.to_item());
      this.$store.state.bookings = await collection.fetchItems(recycleCollection.uuid);

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
