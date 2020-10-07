<template>
  <Page @loaded="onPageLoaded" actionBarHidden="true" background="#f2f2f2">
    <GridLayout>
      <ScrollView>
        <GridLayout rows="auto, *" padding="0 0">
          <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
          <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
          <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
          <StackLayout row="1" marginTop="18">
            <StackLayout marginTop="3" padding="0" margin="0 10">
              <Label text="Hämtningar i ditt område" fontWeight="bold" fontSize="21" class="titleColor" />
              <GridLayout v-for="(item, index) in pantRuns" :key="item.id" columns="auto,*" borderBottomColor="#ddd" :borderBottomWidth="index == pantRuns.length - 1 ? 0 : 1" padding="10 0" margin="0 10">
                <Image col="0" src="~/assets/images/icon_clock@3x.png" stretch="fill" verticalAlignment="center" marginRight="15" width="30" height="30"/>
                <StackLayout col=1>
                  <Label margin="2 0" textWrap="true" fontSize="18" class="bodyTextColor">{{item.time}}</Label>
                  <Label class="bodyTextColor" textWrap="true" margin="2 0" fontSize="18">
                    <FormattedString>
                      <Span text="Hämtare: "/>
                      <Span fontWeight="bold">{{item.collector}}</Span>
                    </FormattedString>
                  </Label>
                </StackLayout>
              </GridLayout>
              <Label text="Dina bokade hämtningar" fontWeight="bold" fontSize="21" class="titleColor" marginTop="20" />
              <GridLayout v-for="(item, index) in bookedRuns" :key="item.id" columns="*, auto" padding="10 15" margin="5 10" borderRadius="20" backgroundColor="white" androidElevation="12">
                <StackLayout col=0>
                  <Label margin="2 0" textWrap="true" fontSize="18" class="bodyTextColor" fontWeight="bold">{{item.title}}</Label>
                  <Label class="bodyTextColor" textWrap="true" margin="2 0" fontSize="18" fontStyle="italic">{{item.text}}</Label>
                </StackLayout>
                <Image col="1" :src="statusImages[item.status]" stretch="fill" verticalAlignment="center" marginRight="15" width="30" height="30"/>
              </GridLayout>

              <GridLayout borderRadius="20" verticalAlignment="center" horizontalAlignment="center" background="white" androidElevation="12" margin="40 10" padding="25">
                <StackLayout>
                  <StackLayout borderBottomColor="#ddd" borderBottomWidth="1">
                    <Image src="~/assets/images/icon_psuh_notification@3x.png" stretch="none" horizontalAlignment="center" />
                    <Label text="Håll dig uppdaterad" fontWeight="bold" fontSize="21" class="titleColor" marginTop="10" />
                    <Label text="Pushnotiser är det snabbaste och smidigaste sättet att få information om när din pant hämtas och/eller när det finns annan panthämtning inbokad i ditt område." marginTop="10" textWrap="true" lineHeight="3" fontSize="18" class="bodyTextColor" />
                  </StackLayout>
                  <GridLayout columns="*, auto" paddingTop="20">
                    <Label column="0" marginBottom="4" text="Aktivera pushnotiser" class="bodyTextColor" fontSize="18"/>
                    <Switch column="1" />
                  </GridLayout>
                </StackLayout>
              </GridLayout>

              <GridLayout rows="*, *" padding="10 15" margin="5 10" borderRadius="20" backgroundColor="white" androidElevation="12">
                <Label row="0" horizontalAlignment="center" text="Du har donerat pant" fontWeight="bold" fontSize="21" class="titleColor" />
                <Image row="1" src="~/assets/images/circle@3x.png" horizontalAlignment="center" width="20%" height="20%"/>
                <Label row="1" text="10" horizontalAlignment="center" color="white" fontSize="25" marginTop="5"/>
                <Label row="1" text="Gånger" horizontalAlignment="center" color="white" fontSize="16" marginTop="30"/>
              </GridLayout>

              <Button @onTap="onBookNewTap" text="Boka ny hämtning" marginTop="20" marginBottom="40" textTransform="none" background="#1f2d40" color="white" borderRadius="40" width="60%" height="57" fontSize="21" class="bodyTextColor"/>
            </StackLayout>
            </StackLayout>
        </GridLayout>
      </ScrollView>
    </GridLayout>
  </Page>

    <!--
    <Page @loaded="onPageLoaded" actionBarHidden="true">
        <GridLayout rows="auto, *, auto, *, auto, *, auto, *, auto, *, auto">
          <StackLayout row="2">
            <Label text="Hämtningar i ditt område" horizontalAlignment="center" fontWeight="bold"/>
            <Label text="Onsdag 21/11 18:00-20:00 Gävle fotboll"/>
            <Label text="Torsdag 22/11 18:00-20:00 Gävle Ridklubb"/>
          </StackLayout>
          <StackLayout row="4">
            <Label text="Bokad hämtning" horizontalAlignment="center" fontWeight="bold"/>
            <Label v-for="(item) in recycleCollectionItems" :key="item.uuid">
              {{ item.properties.start }} - {{item.properties.end}} - {{item.properties.retriever}}
            </Label>
          </StackLayout>
          <Label row="6" text="Du har donerat pant 10 gånger" horizontalAlignment="center" fontWeight="bold"/>
          <StackLayout row="8">
            <Label text="Kontakta oss:" horizontalAlignment="center"/>
            <Label text="x@y.se" horizontalAlignment="center"/>
          </StackLayout>
          <StackLayout row="9" style="border-width: 2px; border-radius: 5px 5px 5px 5px; border-color: #c4c1c0;">
            <Label text="Håll dig uppdaterad genom pushnotifikationer" fontWeight="bold" horizontalAlignment="center"/>
            <Label textWrap="true" horizontalAlignment="center" text="Pushar är det snabbaste och smidigaste sättet att få information om när din pant hämtas och/eller när det finns annan panthämtning inbokad i ditt område."/>
            <Button @onTap="onAllowNotificationsTap" text="Tillåt pushnotifikationer"/>
          </StackLayout>
          <Button @onTap="onBookNewTap" row="10" text="Boka ny hämtning"/>
        </GridLayout>
    </Page>
    -->
</template>

<script>
  import PlaceMarker from './PlaceMarker'
  import session from '../services/session'
  import collection from '../services/collection'

  export default {
    data() {
      return {
        statusImages: {
          "waiting": "~/assets/images/icon_delete@3x.png",
          "confirmed": "~/assets/images/icon_pantr_on_way@3x.png",
          "done": "~/assets/images/icon_done@3x.png",
        },
        bookedRuns: [
          {
            id:"a",
            title: "2020-09-28 - Bokad hämtning",
            text: "Gävle fotboll",
            status: "waiting",
          },
          {
            id:"b",
            title: "2020-09-28 - Bokad hämtning",
            text: "Gävle ridklubb",
            status: "confirmed",
          },
          {
            id:"c",
            title: "2020-08-14 - Bokad hämtning",
            text: "Gävle hockey",
            status: "done",
          },
        ],
        pantRuns: [
          {
            id:1,
            time: "Onsdag 21/11 18:00-20:00",
            collector: "Gävle fotboll",
          },
          {
            id:2,
            time: "Onsdag 21/11 18:00-20:00",
            collector: "Gävle ridklubb",
          },
          {
            id:3,
            time: "Onsdag 21/11 18:00-20:00",
            collector: "Gävle hockey",
          },
        ]
      }
    },
    methods: {
      dateToString(date) {
          const str = `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          return str;
      },
      async onPageLoaded() {
        console.log("page loaded");
        if (session.token == null) {
          await session.create("recycleconsumer@gia.fpx.se", "test");
        }
        
        const collections = await collection.fetchCollections();
        const recycleCollection = collections.find(c => c.name == "fpx_recycle_consumer" && c.provider_uuid == session.user.provider_uuid);
        
        if (recycleCollection != null) {
          const recycleCollectionItems = await collection.fetchItems(recycleCollection.uuid);
          this.bookedRuns = [];

          for (const item of recycleCollectionItems) {
            this.bookedRuns.push({
              id: item.id,
              title: this.dateToString(new Date(item.properties.start)) + " - Bokad hämtning",
              text: item.properties.retriever,
              status: item.properties.status
            });
          }
        }
      },
      onBookNewTap() {
        this.$navigateTo(PlaceMarker);
      },
      onAllowNotificationsTap() {
        
      }
    }
  }
</script>

<style scoped>
</style>
