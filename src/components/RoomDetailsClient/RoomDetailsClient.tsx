"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { getStripe } from "@/libs/stripe";
import HotelPhotoGallery from "@/components/HotelPhotoGallery/HotelPhotoGallery";
import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";
import BookRoomCta from "@/components/BookRoomCTA/BookRoomCta";
import RoomReview from "@/components/RoomReview/RoomReview";
import { Room } from "@/models/room";

interface Props {
  room: Room;
}

const RoomDetailsClient = ({ room }: Props) => {
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [noOfChildren, setNoOfChildren] = useState(0);

  const calcMinCheckoutDate = () => {
    if (checkinDate) {
      const nextDay = new Date(checkinDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return null;
  };

  const calcNumDays = () => {
    if (!checkinDate || !checkoutDate) return;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    return Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
  };

  const handleBookNow = async () => {
    if (!checkinDate || !checkoutDate)
      return toast.error("Please provide checkin / checkout date");

    if (checkinDate > checkoutDate)
      return toast.error("Checkin date cannot be after checkout");

    const numberOfDays = calcNumDays();
    const hotelRoomSlug = room.slug.current;
    const stripe = await getStripe();

    try {
      const { data: stripeSession } = await axios.post("/api/stripe", {
        hotelRoomSlug,
        checkinDate,
        checkoutDate,
        numberOfDays,
        adults,
        children: noOfChildren,
      });

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: stripeSession.id,
        });

        if (result.error) toast.error("Payment Failed");
      }
    } catch (error) {
      toast.error("Payment error occurred");
      console.log(error);
    }
  };

  return (
    <div>
      <HotelPhotoGallery photos={room.images} />

      <div className="container mx-auto mt-20">
        <div className="md:grid md:grid-cols-12 gap-10 px-3">
          <div className="md:col-span-8 md:w-full">
            <h2 className="font-bold text-left text-lg md:text-2xl">
              {room.name} ({room.dimension})
            </h2>

            <div className="flex my-11">
              {room.offeredAmenities.map((amenity) => (
                <div
                  key={amenity._key}
                  className="md:w-44 w-fit text-center px-2 md:px-0 h-20 md:h-40 mr-3 bg-[#eff0f2] dark:bg-gray-800 rounded-lg grid place-content-center"
                >
                  <i className={`fa-solid ${amenity.icon} md:text-2xl`}></i>
                  <p className="text-xs md:text-base pt-3">{amenity.amenity}</p>
                </div>
              ))}
            </div>

            <h2 className="font-bold text-3xl mb-2">Description</h2>
            <p>{room.description}</p>

            <h2 className="font-bold text-3xl mb-2 mt-11">Safety And Hygiene</h2>
            <div className="grid grid-cols-2">
              <div className="flex items-center my-1">
                <MdOutlineCleaningServices />
                <p className="ml-2">Daily Cleaning</p>
              </div>
              <div className="flex items-center my-1">
                <LiaFireExtinguisherSolid />
                <p className="ml-2">Fire Extinguishers</p>
              </div>
              <div className="flex items-center my-1">
                <AiOutlineMedicineBox />
                <p className="ml-2">Disinfections and Sterilizations</p>
              </div>
              <div className="flex items-center my-1">
                <GiSmokeBomb />
                <p className="ml-2">Smoke Detectors</p>
              </div>
            </div>

            <div className="shadow dark:shadow-white rounded-lg p-6 mt-11">
              <p className="md:text-lg font-semibold">Customer Reviews</p>
              <RoomReview roomId={room._id} />
            </div>
          </div>

          <div className="md:col-span-4">
            <BookRoomCta
              discount={room.discount}
              price={room.price}
              specialNote={room.specialNote}
              checkinDate={checkinDate}
              setCheckinDate={setCheckinDate}
              checkoutDate={checkoutDate}
              setCheckoutDate={setCheckoutDate}
              calcMinCheckoutDate={calcMinCheckoutDate}
              adults={adults}
              setAdults={setAdults}
              noOfChildren={noOfChildren}
              setNoOfChildren={setNoOfChildren}
              isBooked={room.isBooked}
              handleBookNow={handleBookNow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsClient;
