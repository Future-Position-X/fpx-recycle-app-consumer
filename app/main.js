import Vue from 'nativescript-vue'


import App from './components/App'
import Intro from './components/Intro'
import VueDevtools from 'nativescript-vue-devtools'
import {BackgroundFetch} from "nativescript-background-fetch";
import booking from './services/booking'
import {BookingStatus} from './models'
import notification from './services/notification'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store'
import localStore from './services/local-store';
import { ApplicationSettings } from 'tns-core-modules';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')
Vue.registerElement('Carousel', () => require('nativescript-carousel').Carousel);
Vue.registerElement('CarouselItem', () => require('nativescript-carousel').CarouselItem);
Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown);
Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView)

new Vue({
  store,
  render: h => h('frame', [h(App)])
  //render: h => h('frame', [h(Intro)])
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
  if (appSettings.getBoolean("allow_push", false)) {
    const localBookings = await localStore.getLocalBookings();
    const latestBookings = await booking.updateBookings();

    for (const latestBooking of latestBookings) {
      for (const localBooking of localBookings) {
        if (localBooking.uuid === latestBooking.uuid &&
            localBooking.status !== latestBooking.status) {
            showNotification(latestBooking.status);
        }
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
  if (appSettings.getBoolean("allow_push", false)) {
    const localBookings = await localStore.getLocalBookings();
    const latestBookings = await booking.updateBookings();

    for (const latestBooking of latestBookings) {
      for (const localBooking of localBookings) {
        if (localBooking.uuid === latestBooking.uuid &&
            localBooking.status !== latestBooking.status) {
            showNotification(latestBooking.status);
        }
      }
    }
  }
});

function showNotification(pantr_status) {
  console.log("showing notification");
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

  notification.show(title);
}

//