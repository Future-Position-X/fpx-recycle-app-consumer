import Vue from 'nativescript-vue'


import App from './components/App'
import Intro from './components/Intro'
import VueDevtools from 'nativescript-vue-devtools'
import {BackgroundFetch} from "nativescript-background-fetch";
import { Color } from "tns-core-modules/color";
import { LocalNotifications } from "nativescript-local-notifications";
import booking from './services/booking'
import {BookingStatus} from './models'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')
Vue.registerElement('Carousel', () => require('nativescript-carousel').Carousel);
Vue.registerElement('CarouselItem', () => require('nativescript-carousel').CarouselItem);
Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown);
Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView)

new Vue({
  store,
  //render: h => h('frame', [h(App)])
  render: h => h('frame', [h(Intro)])
}).$start()

BackgroundFetch.status((status) => {
  console.log('BackgroundFetch status: ', status);
});

BackgroundFetch.configure({
  stopOnTerminate: false,
  enableHeadless: true,
  minimumFetchInterval: 1,  // minutes
  startOnBoot: true          // Android-only
}, async () => {
  console.log("[js] BackgroundFetch event received");
  //
  // Do stuff.  You have 30s of background-time.
  //
  // When your job is complete, you must signal completion or iOS can kill your app.  Signal the nature of the fetch-event, whether you recevied:
  // FETCH_RESULT_NEW_DATA: Received new data from your server
  // FETCH_RESULT_NO_DATA:  No new data received from your server
  // FETCH_RESULT_FAILED:  Failed to receive new data.
  if (store.state.bookings.length == 0)
    return;

  await booking.updateBookings();
  const latestBookings = await booking.getCurrentUserBookings();

  for (const latestBooking of latestBookings) {
    for (const oldBooking of store.state.bookings) {
      if (oldBooking.uuid === latestBooking.uuid && oldBooking.properties.pantr_status !== latestBooking.properties.pantr_status) {
        showNotification(latestBooking.properties.pantr_status);
      }
    }
  }
  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
}, (status) => {
  console.log('BackgroundFetch not supported by your OS', status);
});

BackgroundFetch.registerHeadlessTask(async function () {
  console.log("CALLED HEADLESS TASK")
  //console.log(LocalNotifications.hasPermission());

  if (store.state.bookings.length == 0)
    return;

  await booking.updateBookings();
  const latestBookings = await booking.getCurrentUserBookings();

  for (const latestBooking of latestBookings) {
    for (const oldBooking of store.state.bookings) {
      if (oldBooking.uuid === latestBooking.uuid && oldBooking.properties.pantr_status !== latestBooking.properties.pantr_status) {
        showNotification(latestBooking.properties.pantr_status);
      }
    }
  }
});

function showNotification(pantr_status) {
  let title;

  switch (pantr_status) {
  case BookingStatus.WAITING:
  default:
    throw new Error("invalid status: " + pantr_status);
  case BookingStatus.CONFIRMED:
    title = "En panthämtare har valt att hämta din pant!";
    break;
  case BookingStatus.DONE:
    title = "Din pant har hämtats!";
    break;
  }

  LocalNotifications.schedule(
    [{
      id: 1,
      title: title,
      subtitle: 'subtitle',
      body: 'body',
      bigTextStyle: false, // Allow more than 1 row of the 'body' text on Android, but setting this to true denies showing the 'image'
      color: new Color("green"),
      //image: "https://images-na.ssl-images-amazon.com/images/I/61mx-VbrS0L.jpg",
      //thumbnail: "https://2.bp.blogspot.com/-H_SZ3nAmNsI/VrJeARpbuSI/AAAAAAAABfc/szsV7_F609k/s200/emoji.jpg",
      forceShowWhenInForeground: true,
      channel: "vue-channel",
      ticker: "Special ticker text for Vue (Android only)",
      at: new Date(new Date().getTime() + (1 * 1000)), // 1 second from now
      actions: [
        {
          id: "yes",
          type: "button",
          title: "Yes (and launch app)",
          launch: true
        },
        {
          id: "no",
          type: "button",
          title: "No",
          launch: false
        }
      ]
    }])
    .then(() => {
      console.log("notification scheduled");
    })
    .catch(error => console.log("doSchedule errorr: " + error));
}

//