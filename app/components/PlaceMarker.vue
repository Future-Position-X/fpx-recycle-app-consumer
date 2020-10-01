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
              zoomLevel="15"
              showUserLocation="false"
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
          <Image src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
          <Button @onTap="onRetrievePositionTap" text="Boka hämtning" verticalAlignment="bottom" horizontalAlignment="bottom" marginBottom="39" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21"/>
          <!--<Label class="primaryTextColor" textAlignment="center" padding="5" textWrap="true" marginTop="150" lineHeight="3" fontSize="18" background="white" borderRadius="20" width="80%" height="50" verticalAlignment="top">
            <FormattedString>
              <Span text="Det finns"/>
              <Span text=" 5 " fontWeight="bold" />
              <Span text="panthämtare i området"/>
            </FormattedString>
          </Label>-->
          <FlexboxLayout justifyContent="center" alignItems="center" androidElevation="12" background="white" borderRadius="20" width="80%" height="60" verticalAlignment="top" marginTop="90">
            <Label fontSize="18">
              <FormattedString>
                <Span text="Det finns"/>
                <Span text=" 5 " fontWeight="bold" />
                <Span text="panthämtare i området"/>
              </FormattedString>
            </Label>
          </FlexboxLayout>
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

  export default {
    data() {
      return {
        
      }
    },
    methods: {
        async onSaveTap() {
          const center = await this.$refs.map.nativeView.getCenter();
          this.$store.state.selectedCoordinates = center;
          this.$navigateTo(Info);
        },
        onRetrievePositionTap() {
          this.$navigateTo(Info);
        },
        async onMapReady(args) {
        /*args.map.addMarkers([
          {
            lat: 60.6708058985168,
            lng: 17.14024985657789,
            title: "Gävle, SE",
            subtitle: "Noice",
            onCalloutTap: () => {
              utils.openUrl("https://fpx.se/");
            }
          }
        ]);*/
      }
    }
  }
</script>

<style scoped>
</style>
