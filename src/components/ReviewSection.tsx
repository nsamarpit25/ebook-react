import { FC } from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RichEditor from "./rich-editor";

export interface Review {
  content: string;
  date: string;
  id: string;
  rating: number;
  user: {
    id: string;
    name: string;
    avatar?: {
      url: string;
    };
  };
}

interface Props {
  title?: string;
  id?: string;
  reviews: Review[];
}

const ReviewSection: FC<Props> = ({ id, reviews }) => {
  const { profile } = useAuth();

  const alreadyPurchased = id && profile?.books?.includes(id) || false;
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Reviews
        </h2>
        {alreadyPurchased? <Link
          to={`/rate/${id}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
        >
          Write a Review
        </Link> : null}
      </div>

      {!reviews.length ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {alreadyPurchased ? 'Be the first to review this book': 'Buy Now to add review'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600">
                    {review.user.avatar?.url ? (
                      <img
                        src={review.user.avatar.url}
                        alt={review.user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-gray-500 dark:text-gray-400">
                        {review.user.name[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {review.user.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span className="font-medium">{review.rating}</span>
                      <FaStar />
                    </div>
                  </div>

                  {review.content && (
                    <RichEditor
                      editable={false}
                      value={review.content}
                      className="text-gray-600 dark:text-gray-300 prose-sm regular"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
