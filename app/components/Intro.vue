<template>
    <Page actionBarHidden="true" style="margin: 5px;">
        <GridLayout width="90%" height="90%">
          <GridLayout height="500" background="#CCCCCCCC">
            <Image src="~/assets/images/icon_can.png" stretch="none" verticalAlignment="top" horizontalAlignment="center" style="border-width: 2px;border-color: red"/>
            <GridLayout height="400">
              <Carousel style="border-width: 2px;border-color: red" width="100%" height="100%" background="#CCCCCCCC" indicatorColor="#757575" indicatorColorUnselected="#989898" finite="true" bounce="false" showIndicator="true" android:indicatorAnimation="swap">
                <CarouselItem verticalAlignment="middle" style="border-width: 2px;border-color: red">
                    <GridLayout style="border-width: 2px;border-color: red">
                      <StackLayout horizontalAlignment="center" verticalAlignment="center">
                        <Label text="Välkommen!" fontWeight="bold"/>
                        <Label textWrap="true" text="Med hjälp av denna tjänst kan du enkelt skänka din pant till lokala föreningar och skolor."/>
                        <Label textWrap="true" text="Panten hämtas där du bor, och du slipper allt besvär med att själv transportera och panta den, pengarna går oavkortat till den som hämtar den."/>
                      </StackLayout>
                    </GridLayout>
                </CarouselItem>
                <CarouselItem verticalAlignment="middle">
                    <GridLayout>
                      <StackLayout horizontalAlignment="center" verticalAlignment="center">
                        <Label text="Såhär fungerar det:" fontWeight="bold"/>
                        <Label textWrap="true" text="Du placerar ut en plats på kartan där din pant kan hämtas upp."/>
                        <Label textWrap="true" text="Om din plats ligger inom ett upphämtningsområde kan din pant hämtas upp. Om du inte vill ställa ut din pant i förväg kan du skriva instruktioner om hur överlämningen bör gå till."/>
                      </StackLayout>
                    </GridLayout>
                </CarouselItem>
                <CarouselItem verticalAlignment="middle">
                    <GridLayout>
                      <StackLayout horizontalAlignment="center" verticalAlignment="center">
                        <Label text="Frågor och support" fontWeight="bold"/>
                        <Label textWrap="true" text="Du kan alltid kontakta oss på x@y.se om du stöter på problem, undrar över något eller vill lämna feedback."/>
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
      return {
      }
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
