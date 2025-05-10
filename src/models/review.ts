export type UpdateReviewDto = {
   reviewId: string;
   reviewText: string;
   userRating: number;
};


export type createReviewDto = {
   hotelRoomId: string;
   reviewtext: string;
   userRating: number;
   userId: string;
};



export type Review = {
    text: string;
    user: {name: string};
    userRating: number;
    _createdAt: Date,
    _id: string,
};