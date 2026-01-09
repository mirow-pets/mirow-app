import { TBooking, TBookingStatus } from "./bookings";
import { TPet } from "./pets";

export interface TCalendarEvent {
  title: string;
  description1: string;
  description2: string;
  start: Date;
  end?: Date;
  type: "booking" | "vaccination";
  metadata: {
    bookingId?: TBooking["id"];
    petId?: TPet["id"];
    status: TBookingStatus["display"];
  };
}
