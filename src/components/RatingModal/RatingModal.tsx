import { Dispatch, FC, SetStateAction } from "react";
import { BsStarFill } from "react-icons/bs";



type Props = {
  isOpen: boolean;
  ratingValue: number | null;
  setRatingValue: Dispatch<SetStateAction<number | null>>; 
  ratingText: string;
  setRatingText: Dispatch<SetStateAction<string>>; 
  reviewSubmitHandler: () => Promise<string | undefined>;
  submittingReview: boolean;
  toggleRatingModal: () => void;
};


const RatingModal: FC<Props> = (props) => {

  const {
     isOpen, 
     ratingValue, 
     setRatingValue, 
     ratingText, 
     setRatingText, 
     reviewSubmitHandler, 
     submittingReview, 
     toggleRatingModal
  } = props;


  const starValues = [1, 2, 3, 4, 5];


  return (
    <div className={`fixed z-[61] inset-0 flex items-center justify-center ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>

     <div className="bg-white w-96 p-4 rounded-lg shadow-lg">

        <h2 className="text-xl dark:text-gray-800 font-semibold mb-2">
            Rate Your Experience
        </h2>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
               Rating
            </label>
            <div className="flex items-center">
               {starValues.map(value => (
                 <button 
                   className={`w-6 h-6 ${ratingValue === value ? "text-yellow-500" : "text-gray-300"}`}
                   key={value} 
                   onClick={() => setRatingValue(value)}
                 >
                 <BsStarFill />
               </button>))}
            </div>
        </div>

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
               Drop Review
            </label>
            <textarea value={ratingText} onChange={e => setRatingText(e.target.value)} rows={4} className="w-full px-2 py-3 border rounded-md"></textarea>
        </div>

        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md" onClick={reviewSubmitHandler}
            disabled={submittingReview}
          >
           {submittingReview ? "Submitting" : "Submit"} 
          </button>

          <button onClick={toggleRatingModal} className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
            Cancel
          </button>
        </div>

     </div>

    </div>
  )
}

export default RatingModal
