<template>
  <Page @loaded="onPageLoaded" @navigatingFrom="onPageNavigatingFrom" actionBarHidden="true" background="#f2f2f2">
    <GridLayout>
      <ActivityIndicator v-if="isFetchingData" verticalAlignment="center" busy="true"/>
      <ScrollView>
        <GridLayout minHeight="500" rows="*,*" padding="0 0">
          <Image row="0" src="~/assets/images/dots.png" stretch="fill" horizontalAlignment="left" verticalAlignment="top" marginTop="30" marginLeft="25" width="25" height="25"/>
          <Image row="0" src="~/assets/images/Pantr_logo@3x.png" stretch="fill" horizontalAlignment="center" verticalAlignment="top" width="150" height="35" marginTop="25"/>
          <Image row="0" src="~/assets/images/icon_help@3x.png" stretch="fill" horizontalAlignment="right" verticalAlignment="top" marginTop="30" marginRight="25" width="25" height="25"/>
          
          <StackLayout v-if="!isFetchingData" row="1" marginTop="18">
            <StackLayout marginTop="3" padding="0" margin="0 10">
              <!--<Label text="Hämtningar i ditt område" fontWeight="bold" fontSize="21" class="titleColor" />
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
              </GridLayout>-->
              <Label text="Dina bokade hämtningar" fontWeight="bold" fontSize="21" class="titleColor" marginTop="20" />
              <GridLayout v-for="(item) in bookedRuns" :key="item.id" columns="*, auto" padding="10 15" margin="5 10" borderRadius="20" backgroundColor="white" androidElevation="12">
                <StackLayout col=0>
                  <Label margin="2 0" textWrap="true" fontSize="18" class="bodyTextColor" fontWeight="bold">{{item.title}}</Label>
                  <Label class="bodyTextColor" textWrap="true" margin="2 0" fontSize="18" fontStyle="italic">{{item.collector}}</Label>
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
                    <Switch column="1" v-model="allowPush" @checkedChange="onAllowPushChange" />
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
</template>

<script>
  import PlaceMarker from './PlaceMarker'
  import {BookingStatus} from "../models";
  import bookingService from '../services/booking';
  const application = require('tns-core-modules/application');
  const timer = require('tns-core-modules/timer');
  const appSettings = require("tns-core-modules/application-settings");

  const getStatusImages = function() {
    const statusImages = {};
    statusImages[BookingStatus.WAITING] = "~/assets/images/icon_delete@3x.png";
    statusImages[BookingStatus.CONFIRMED] = "~/assets/images/icon_pantr_on_way@3x.png";
    statusImages[BookingStatus.DONE] = "~/assets/images/icon_done@3x.png";
    return statusImages;
  };

  export default {
    data() {
      return {
        isFetchingData: false,
        statusImages:  getStatusImages(),
        bookedRuns: [],
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
        ],
        recycleCollection: null,
        updateIntervalId: 0,
        allowPush: false
      }
    },
    methods: {
      dateToString(date) {
          const str = `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          return str;
      },
      onPageNavigatingFrom(){
        console.log("navigating from");
        
        if (this.updateIntervalId !== 0) {
          timer.clearInterval(this.updateIntervalId);
        }

        application.off(application.suspendEvent);
        application.off(application.resumeEvent);
      },
      async onPageLoaded() {
        this.allowPush = appSettings.getBoolean("allow_push", false);
        application.on(application.suspendEvent, (args) => {
          console.log("application suspend event");

          if (this.updateIntervalId !== 0) {
            timer.clearInterval(this.updateIntervalId);
            this.updateIntervalId = 0;
          }
        });

        application.on(application.resumeEvent, (args) => {
            if (args.android) {
                // For Android applications, args.android is an android activity class.
                console.log("WOOT Activity: " + args.android);
            } else if (args.ios) {
                // For iOS applications, args.ios is UIApplication.
                console.log("WOOT UIApplication: " + args.ios);
            }
        });
        
        console.log("page loaded");
        this.isFetchingData = true;
        
        await this.updateBookings();
        this.isFetchingData = false;
        //this.updateIntervalId = timer.setInterval(this.update, 5000);
        this.updateIntervalId = timer.setInterval(this.update, 30000);
      },
      onAllowPushChange() {
        appSettings.setBoolean("allow_push", this.allowPush);
      },
      async update() {
        console.log("update called");
        //this.isFetchingData = true;
        await this.updateBookings();
        //this.isFetchingData = false;
      },
      async updateBookings()
      {
        const bookings = await bookingService.updateBookings();
        let retrievers = {}
        // This should probably be done with one request where one could send multiple item uuids, like collection_uuids
        for(const booking of bookings) {
          const retriever = await bookingService.getRetrieverFromBooking(booking);
          retrievers[retriever.uuid] = retriever;
        }

        let bookedRuns = [];
        for (const booking of bookings) {
          bookedRuns.push({
            id: booking.uuid,
            title: this.dateToString(new Date(booking.start)) + " - Bokad hämtning",
            collector: retrievers[booking.retriever_uuid].name,
            status: booking.status
          });
        }
        this.bookedRuns = bookedRuns;
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
