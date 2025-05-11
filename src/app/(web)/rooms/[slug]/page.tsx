import { getroom } from "@/libs/apis";
import RoomDetailsClient from "@/components/RoomDetailsClient/RoomDetailsClient";
import LoadingSpinner from "../../loading";

type Props = {
  params: { slug: string };
};

const RoomDetailsPage = async ({ params }: Props) => {
  const room = await getroom(params.slug);

 if(typeof room === "undefined")  
    throw new Error("Cannot fetch data");
 if(!room) return <LoadingSpinner />;

  return <RoomDetailsClient room={room} />;
};

export default RoomDetailsPage;

