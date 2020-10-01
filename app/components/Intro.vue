<template>
  <Page actionBarHidden="true" class="coverImage" margin="0">
    <GridLayout width="100%" height="90%">
      <Image src="~/assets/images/Pantr_logo@3x.png" stretch="none" horizontalAlignment="center" />
      <GridLayout height="500" background="white" margin="28" padding="0" borderRadius="20" androidElevation="12">
        <GridLayout margin="30 30 15">
          <Carousel width="100%" height="85%" indicatorColor="#26001c" indicatorColorUnselected="#f2f2f2" finite="true"
                    bounce="false" showIndicator="true" android:indicatorAnimation="swap" marginBottom="45" verticalAlignment="bottom">
            <CarouselItem>
              <GridLayout>
                <StackLayout>
                  <Image src="~/assets/images/icon_can@3x.png" stretch="none" horizontalAlignment="center" />
                  <Label text="Välkommen!" fontWeight="bold" fontSize="45" class="primaryTextColor" />
                  <Label class="primaryTextColor" textWrap="true" marginTop="17" lineHeight="3" fontSize="18"
                         text="Med hjälp av denna tjänst kan du enkelt skänka din pant till lokala föreningar och skolor."/>
                  <Label class="primaryTextColor" textWrap="true" marginTop="17" lineHeight="3" fontSize="18"
                         text="Panten hämtas där du bor, och du slipper allt besvär med att själv transportera och panta den, pengarna går oavkortat till den som hämtar den."/>
                </StackLayout>
              </GridLayout>
            </CarouselItem>
            <CarouselItem>
              <GridLayout>
                <StackLayout>
                  <Image src="~/assets/images/icon_mapmark@3x.png" stretch="none" horizontalAlignment="center" />
                  <Label text="Såhär fungerar det:" fontWeight="bold" fontSize="25" class="primaryTextColor" marginTop="41" />
                  <Label class="primaryTextColor" textWrap="true" marginTop="22" lineHeight="3" fontSize="18"
                         text="Du placerar ut en plats på kartan där din pant kan hämtas upp."/>
                  <Label class="primaryTextColor" textWrap="true" marginTop="17" lineHeight="3" fontSize="18"
                         text="Om din plats ligger inom ett upphämtningsområde kan din pant hämtas upp. Om du inte vill ställa ut din pant i förväg kan du skriva instruktioner om hur överlämningen bör gå till."/>
                </StackLayout>
              </GridLayout>
            </CarouselItem>
            <CarouselItem>
              <GridLayout>
                <StackLayout>
                  <Image src="~/assets/images/icon_que@3x.png" stretch="none" horizontalAlignment="center" />
                  <Label text="Frågor & support" fontWeight="bold" fontSize="25" class="primaryTextColor" marginTop="41" />
                  <Label class="primaryTextColor" textWrap="true" marginTop="22" lineHeight="3" fontSize="18">
                    <FormattedString>
                      <Span text="Stöter du på något problem eller undrar om något gällande appen så kan du alltid kontakta oss på"/>
                      <Span text=" info@pantr-app.se " fontWeight="bold" />
                      <Span text="Vi försöker svara så snabbt vi kan."/>
                    </FormattedString>
                  </Label>
                </StackLayout>
              </GridLayout>
            </CarouselItem>
          </Carousel>
        </GridLayout>
      </GridLayout>
      <!--<Button @onTap="onReadyTap" row="5" text="Jag är redo" verticalAlignment="bottom"/>-->
    </GridLayout>
  </Page>
</template>

<script>
import App from './App'

export default {
  data() {
    return {}
  },
  methods: {
    onReadyTap() {
      this.$navigateTo(App);
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
