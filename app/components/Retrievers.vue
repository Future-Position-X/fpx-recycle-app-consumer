<template>
  <Page actionBarHidden="true" class="coverImage" margin="0">
    <GridLayout width="100%" height="90%">
      <Image src="~/assets/images/Pantr_logo@3x.png" stretch="none" horizontalAlignment="center" />
      <GridLayout height="500" background="white" margin="28" padding="0" borderRadius="20" androidElevation="12">
        <GridLayout margin="30 30 15" background="white" rows="auto, auto, auto">
          <Label row="0" textWrap="true" text="Följande panthämtare har anmält intresse av att hämta din pant."/>
          <Label row="1" textWrap="true" marginTop="5" marginBottom="5" text="Bekräfta vem som får ansvaret genom att välja den i listan."/>
          <ListPicker row="2" :items="retrievers" v-model="selectedIndex"/>
        </GridLayout>
      </GridLayout>
      <Button @onTap="onConfirmTap" text="Bekräfta" verticalAlignment="bottom" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21"/>
    </GridLayout>
  </Page>
</template>

<script>
import PlaceMarker from './PlaceMarker'

export default {
  data() {
    return {
        retrievers: [
            "Gävle Nätverksklubb",
            "Gävle Ridklubb",
            "Gävle Hockeyklubb"
        ],
        selectedIndex: 0
    }
  },
  methods: {
    onConfirmTap() {
      console.log("selected index: " + this.selectedIndex);
    }
  }
}
</script>

<style scoped>
.coverImage {
  background-image: url('~/assets/images/pantr_welcome_bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
