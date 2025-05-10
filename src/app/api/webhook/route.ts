import { createBooking, updateHotelRoom } from "@/libs/apis";
import { NextResponse } from "next/server";
import Stripe from "stripe";



const checkout_session_completed = "checkout.session.completed"



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-04-30.basil",
});



export async function POST(req: Request, res: Response) {
    const reqBody = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return;
        event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, {status: 500} );
    }

    // loading our event
    switch (event.type) {
        case checkout_session_completed:

            const session = event.data.object as Stripe.Checkout.Session;

            const {
                adults,
                hotelRoom,
                discount,
                checkoutDate,
                children,
                numberOfDays,
                checkinDate,
                totalPrice,
                user,
            } = session.metadata as {
                adults: string;
                hotelRoom: string;
                discount: string;
                checkoutDate: string;
                children: string;
                numberOfDays: string;
                checkinDate: string;
                totalPrice: string;
                user: string;
            };

            await createBooking({
                adults: Number(adults),
                checkinDate,
                checkoutDate,
                children: Number(children),
                hotelRoom,
                numberOfDays: Number(numberOfDays),
                discount: Number(discount),
                totalPrice: Number(totalPrice),
                user,
            });

            await updateHotelRoom(hotelRoom);

            return NextResponse.json("Booking successful", {
                status: 200,
                statusText: "Booking Succcessful",
            });

        default:
            console.log(`Unahndled event type ${event.type}`);
    }


    return NextResponse.json("Event Recieved", {
        status: 200,
        statusText: "Event Recieved",
    });

};


