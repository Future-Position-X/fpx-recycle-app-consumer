const appSettings = require("tns-core-modules/application-settings");
const assert = require("assert");

const LOCAL_BOOKINGS_KEY = "bookings";

export default {
    getLocalBookings() {
        console.log("retrieving bookings from local storage");
        const localBookings = JSON.parse(appSettings.getString(LOCAL_BOOKINGS_KEY, "[]"));
        return localBookings;
    },
    addNewBooking(booking) {
        console.log("adding new booking to local storage");
        assert(booking.uuid != null);
        const localBookings = JSON.parse(appSettings.getString(LOCAL_BOOKINGS_KEY, "[]"));
        const exists = localBookings.some(lb => lb.uuid === booking.uuid);
        assert(!exists, "booking already exists in local storage");
        localBookings.push(booking);
        appSettings.setString(LOCAL_BOOKINGS_KEY, JSON.stringify(localBookings));
        console.log("local bookings: " + JSON.stringify(localBookings));
    },
    updateBooking(booking) {
        console.log("updating booking in local storage");
        assert(booking.uuid != null);
        const localBookings = JSON.parse(appSettings.getString(LOCAL_BOOKINGS_KEY, "[]"));
        const localBooking = localBookings.find(lb => lb.uuid === booking.uuid);
        assert(localBooking != null, "booking does not exist in local storage");
        localBookings[localBookings.indexOf(localBooking)] = booking;
        appSettings.setString(LOCAL_BOOKINGS_KEY, JSON.stringify(localBookings));
        console.log("local bookings: " + JSON.stringify(localBookings));
    }
};