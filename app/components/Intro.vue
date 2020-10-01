<template>
  <Page actionBarHidden="true" class="coverImage" margin="5">
    <GridLayout width="100%" height="90%">
      <GridLayout height="500" background="white" margin="20" padding="30" borderRadius="20" androidElevation="12">
        <StackLayout>
          <Image src="~/assets/images/icon_can@3x.png" stretch="none" horizontalAlignment="center"/>
          <Carousel width="100%" height="100%" indicatorColor="#26001c" indicatorColorUnselected="#f2f2f2" finite="true"
                    bounce="false" showIndicator="true" android:indicatorAnimation="swap" marginTop="30">
            <CarouselItem>
              <GridLayout>
                <StackLayout>
                  <Label text="Välkommen!" fontWeight="bold" fontSize="45" class="primaryTextColor" />
                  <Label class="primaryTextColor" textWrap="true" marginTop="20"
                         text="Med hjälp av denna tjänst kan du enkelt skänka din pant till lokala föreningar och skolor."/>
                  <Label class="primaryTextColor" textWrap="true" marginTop="20" lineHeight="3"
                         text="Panten hämtas där du bor, och du slipper allt besvär med att själv transportera och panta den, pengarna går oavkortat till den som hämtar den."/>
                </StackLayout>
              </GridLayout>
            </CarouselItem>
            <CarouselItem>
              <GridLayout>
                <StackLayout>
                  <Label text="Såhär fungerar det:" fontWeight="bold"/>
                  <Label textWrap="true" text="Du placerar ut en plats på kartan där din pant kan hämtas upp."/>
                  <Label textWrap="true"
                         text="Om din plats ligger inom ett upphämtningsområde kan din pant hämtas upp. Om du inte vill ställa ut din pant i förväg kan du skriva instruktioner om hur överlämningen bör gå till."/>
                </StackLayout>
              </GridLayout>
            </CarouselItem>
            <CarouselItem>
              <GridLayout>
                <StackLayout>
                  <Label text="Frågor och support" fontWeight="bold"/>
                  <Label textWrap="true"
                         text="Du kan alltid kontakta oss på x@y.se om du stöter på problem, undrar över något eller vill lämna feedback."/>
                </StackLayout>
              </GridLayout>
            </CarouselItem>
          </Carousel>
        </StackLayout>
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
  background-image: url('~/assets/images/pantr_splash.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
