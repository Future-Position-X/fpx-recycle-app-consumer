import collection from './collection'
import session from './session'
import config from "../config";
import {Booking, BookingStatus, Confirmation, Retriever} from "../models";
import localStore from './local-store';

export default {
    async findRetrieversInArea(lat, lng) {
        const retrievers = 
            await collection.fetchItemsByNameWithin(config.RETRIEVER_COLLECTION_NAME, {x: lng, y: lat}, 5000);
        return retrievers.map((i) => Retriever.from_item(i));
    },
    async addNewBooking(booking) {
        const bookingCollection = await this.getBookingCollection();
        console.log("new booking:" + JSON.stringify(booking.to_item()))
        const createdBooking = Booking.from_item(await collection.createItem(bookingCollection.uuid, booking.to_item()));
        localStore.addNewBooking(createdBooking);
    },
    async getBookingCollection() {
        if (!session.authenticated())
            await session.create("recycleconsumer@gia.fpx.se", "test");

        const collections = await collection.fetchCollections();
        let bookingCollection = collections.find(c =>
                c.name === config.BOOKING_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);

        if (bookingCollection == null) {
            bookingCollection = await collection.create(config.BOOKING_COLLECTION_NAME, false);
        }

        return bookingCollection;
    },
    async getRetrieverFromBooking(booking) {
        const item = await collection.fetchItem(booking.retriever_uuid);
        const retriever = Retriever.from_item(item);
        return retriever;
    },
    async updateBookings() {
        const collections = await collection.fetchCollections();
        const recycleCollection = collections.find(c => c.name === config.BOOKING_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);
        let bookings = (await collection.fetchItems(recycleCollection.uuid)).map((i) => Booking.from_item(i));
        const confirmations = (await collection.fetchItemsByName(config.CONFIRMATION_COLLECTION_NAME)).map((i) => Confirmation.from_item(i));

        const confirmations_by_booking = confirmations.reduce((acc, c) => {
            if(acc[c.booking_uuid]) {
            acc[c.booking_uuid].push(c);
            } else {
            acc[c.booking_uuid] = [c];
            }
            acc[c.booking_uuid].sort((a, b) => (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime())
            return acc;
        }, {});

        const new_confirmed_bookings = bookings.filter((b) => b.status == BookingStatus.WAITING && confirmations_by_booking[b.uuid]);
        console.log("new_confirmed_bookings.length: " + new_confirmed_bookings.length);
        if(new_confirmed_bookings.length > 0) {
            for(const new_confirmed_booking of new_confirmed_bookings) {
                new_confirmed_booking.retriever_uuid = confirmations_by_booking[new_confirmed_booking.uuid][0].retriever_uuid;
                new_confirmed_booking.status = BookingStatus.CONFIRMED;
                await collection.updateItem(new_confirmed_booking.uuid, new_confirmed_booking.to_item());
            }
            bookings = (await collection.fetchItems(recycleCollection.uuid)).map((i) => Booking.from_item(i));
        }
        
        const localBookings = localStore.getLocalBookings();

        for (const latestBooking of bookings) {
            for (const localBooking of localBookings) {
                if (localBooking.uuid === latestBooking.uuid &&
                    localBooking.status !== latestBooking.status) {
                    localStore.updateBooking(latestBooking);
                }
            }
        }

        return bookings;
    }
};