<template>
    <Page actionBarHidden="true">
        <GridLayout columns="*" rows="*, auto">
            <Mapbox
              ref="map"
              accessToken="pk.eyJ1IjoidHJpcHRlYyIsImEiOiJja2R0d2ZtNHMwMGM5MzdxNHVwZGcyeG1xIn0.yAZW46zUKkS9RL3O7kBWaQ"
              mapStyle="mapbox://styles/mapbox/light-v9"
              latitude="60.6708058985168"
              longitude="17.14024985657789"
              hideCompass="true"
              zoomLevel="4"
              showUserLocation="true"
              disableZoom="false"
              disableRotation="false"
              disableScroll="false"
              disableTilt="false"
              @mapReady="onMapReady($event)">
          </Mapbox>
          <Image src="~/assets/images/icon_mapmark_onmap@3x.png" stretch="none" horizontalAlignment="center" verticalAlignment="center" marginBottom="87" />
          <!--<Button row="0" @onTap="onRetrievePositionTap" text="Hämta min position" horizontalAlignment="right" verticalAlignment="top"/>-->
          <Image src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
          <Image src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
          <Image src="~/assets/images/icon_help@3x.png" @onTap="onHelpTap" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
          <Button @onTap="onBook" text="Boka hämtning" verticalAlignment="bottom" horizontalAlignment="bottom" marginBottom="39" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21"/>
          <!--<Label class="primaryTextColor" textAlignment="center" padding="5" textWrap="true" marginTop="150" lineHeight="3" fontSize="18" background="white" borderRadius="20" width="80%" height="50" verticalAlignment="top">
            <FormattedString>
              <Span text="Det finns"/>
              <Span text=" 5 " fontWeight="bold" />
              <Span text="panthämtare i området"/>
            </FormattedString>
          </Label>-->
          <FlexboxLayout v-show="!isFetchingCollectors" justifyContent="center" alignItems="center" androidElevation="12" background="white" borderRadius="20" width="80%" height="60" verticalAlignment="top" marginTop="90">
            <Label fontSize="18" class="bodyTextColor">
              <FormattedString>
                <Span text="Det finns"/>
                <Span fontWeight="bold"> {{ availableRetrievers.length }} </Span>
                <Span text="panthämtare i området"/>
              </FormattedString>
            </Label>
          </FlexboxLayout>
          <FlexboxLayout v-show="isFetchingCollectors" justifyContent="center" alignItems="center" androidElevation="12" background="white" borderRadius="20" width="80%" height="60" verticalAlignment="top" marginTop="90">
            <Label text="Letar panthämtare..." fontSize="18" class="bodyTextColor"/>
            <ActivityIndicator :busy="isFetchingCollectors" marginLeft="10"/>
          </FlexboxLayout>

          <GridLayout v-if="showMapHelp" borderRadius="20" verticalAlignment="center" horizontalAlignment="center" background="white" androidElevation="12" margin="30" padding="30">
            <StackLayout>
              <Image src="~/assets/images/icon_mapmark@3x.png" stretch="none" horizontalAlignment="center" />
              <Label text="Placera markören där panten kan hämtas. Försök vara så exakt som möjligt, för att underlätta och snabba upp upphämtningen." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
              <Label text="Särskilt viktigt är det att platsen du väljer är lätt att nå från allmän väg, och att den som hämtar din pant har tillåtelse att beträda området." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
              <Button @onTap="onDismissHelp" text="OK, jag förstår!" verticalAlignment="bottom" marginTop="39" textTransform="none" background="#0aa67a" color="white" borderRadius="40" width="80%" height="57" fontSize="21" class="bodyTextColor"/>
              <Button @onTap="onRetrievePositionTap" text="Hämta min position" verticalAlignment="bottom" marginTop="10" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="80%" height="57" fontSize="21" class="bodyTextColor"/>
            </StackLayout>
          </GridLayout>
          <!--<StackLayout row="1" style="margin: 5px;">
            <Label textWrap="true" text="Placera markören där panten kan hämtas."/>
            <Label textWrap="true" text="Försök vara så exakt som möjligt, för att underlätta och snabba på upphämtningen."/>
            <Label textWrap="true" text="Särskilt viktigt är det att platsen du väljer är lätt att nå från allmän väg, och att den som hämtar din pant har tillåtelse att beträda området."/>
            <Button @onTap="onSaveTap" text="Spara" horizontalAlignment="center"/>
          </StackLayout>-->
        </GridLayout>
    </Page>
</template>

<script>
  import Info from './Info'
  import * as utils from "utils/utils";
  import debounce from 'debounce-async';
  import booking from '../services/booking';
  const appSettings = require("tns-core-modules/application-settings");
  export default {
    data() {
      return {
        showMapHelp: true,
        isFetchingCollectors: true,
        availableRetrievers: [],
        map: null,
        zoomLevel: 4.0,
        debouncedUpdateCollectors: null
      }
    },
    methods: {
        onHelpTap() {
          this.showMapHelp = true;
        },
        onDismissHelp() {
          this.showMapHelp = false;
        },
        async onBook() {
          const center = await this.$refs.map.nativeView.getCenter();
          this.$store.state.selectedCoordinates = center;
          appSettings.setNumber("center_lng", center.lng);
          appSettings.setNumber("center_lat", center.lat);
          this.$navigateTo(Info);
        },
        async onRetrievePositionTap() {
          let location;

          this.showMapHelp = false;

          try {
            location = await this.map.getUserLocation();
          } catch (err) {
            console.log("retrieve pos error: ", err);
            return;
          }

          await this.map.setCenter({
            lat: location.location.lat,
            lng: location.location.lng,
            animated: true
          });

          await this.map.setZoomLevel({
            level: 16
          });
        },
        async updateCollectors(lat, lng) {
          this.isFetchingCollectors = true;
          let retrievers = await booking.findRetrieversInArea(lat, lng);
          this.availableRetrievers = retrievers;
          this.$store.state.availableRetrievers = this.availableRetrievers;
          console.log(retrievers);
          this.map.removeMarkers();
          for (let retriever of retrievers) {
            console.log(retriever);
            this.map.addMarkers([
              {
                lat: retriever.coordinates[1],
                lng: retriever.coordinates[0],
                title: retriever.name
              }
            ]);
          }
          this.isFetchingCollectors = false;
        },
        sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        },
        async onMapScroll(point) {
          if (this.debouncedUpdateCollectors == null) {
            this.debouncedUpdateCollectors = debounce(this.updateCollectors, 500);
          }

          await this.debouncedUpdateCollectors(point.lat, point.lng);
        },
        async onMapReady(args) {
          this.map = args.map;
          let centerLng = appSettings.getNumber("center_lng");
          let centerLat = appSettings.getNumber("center_lat");
          let zoom = true;

          this.map.setOnScrollListener(this.onMapScroll);

          if (centerLng == null || centerLat == null) {
            centerLng = 17.1413864;
            centerLat = 60.6746827;
            zoom = false;
          }

          if (zoom) {
            await this.sleep(1000);
            await this.map.setZoomLevel({
              level: 16,
              animate: true
            });
          }

          await this.updateCollectors(centerLat, centerLng);
        }
      }
    }
</script>

<style scoped>
</style>
