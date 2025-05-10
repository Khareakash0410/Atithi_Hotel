export type Booking = {
    _id: string,
 hotelRoom: {
   _id: string,
   name: string,
   price: number,
   slug: {current: string}
 },
 checkinDate: string,
 checkoutDate: string,
 numberOfDays: number,
 adults: number,
 children: number,
 totalPrice: number,
 discount: number
};