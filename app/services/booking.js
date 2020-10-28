import collection from './collection'
import session from './session'
import config from "../config";
import {Booking, BookingStatus, Confirmation, Retriever} from "../models";
import localStore from './local-store';

export default {
    async getCurrentUserBookings() {
        await session.create("recycleconsumer@gia.fpx.se", "test");
        const collections = await collection.fetchCollections();
        let recycleCollection = collections.find(c => c.name === config.BOOKING_COLLECTION_NAME && c.provider_uuid === session.user.provider_uuid);

        if (recycleCollection == null) {
            recycleCollection = await collection.create(config.BOOKING_COLLECTION_NAME, false);
            return [];
        } else {
            return await collection.fetchItems(recycleCollection.uuid);
        }
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
    }
};