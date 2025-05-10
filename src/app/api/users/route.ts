import { checkReviewExists, createReview, getUserData, updateReview } from "@/libs/apis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
   const session = await getServerSession(authOptions);


   if(!session) {
    return new NextResponse("Authentication Required", {status: 500});
   }



   const userId = session.user.id;

   try {
    const data  = await getUserData(userId);

    return NextResponse.json(data, {status: 200, statusText: "Successful"} );
   } catch (error) {
    return new NextResponse("Uanble to fetch", {status: 400});
   }
};



export async function POST(req: Request, res: Response) {
   const session = await getServerSession(authOptions);

   if(!session) {
    return new NextResponse("Authentication Required", {status: 500});
   };

   const {roomId, ratingText, ratingValue} = await req.json();

   if(!roomId || !ratingText || !ratingValue) {
    return new NextResponse("All fields are required", {status: 400});
   };
   const userId = session.user.id;

   try {
     const alreadyExist = await checkReviewExists(userId, roomId);

     let data;

     if(alreadyExist) {
        data = await updateReview({reviewId: alreadyExist._id, reviewText: ratingText, userRating: ratingValue});
     } else {
        data = await createReview({hotelRoomId: roomId, reviewtext: ratingText, userRating: ratingValue, userId});
     }

     return NextResponse.json(data, {status: 200, statusText: "Successful"});
   } catch (error: any) {
      console.log("Error Updating", error);
      return new NextResponse("Unable to review", {status: 400});
   }
};