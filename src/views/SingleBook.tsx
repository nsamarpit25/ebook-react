import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import BookDetail, { Book } from "../components/BookDetail";
import { ParseError } from "../utils/helper";

import RecommendedSection from "../components/RecommendedSection";
import ReviewSection, { Review } from "../components/ReviewSection";
import Skeletons from "../components/Skeletons";

interface Props {}

const fetchBookReviews = async (id: string) => {
  const { data } = await client.get("/review/list/" + id);
  return data.reviews;
};

const SingleBook: FC<Props> = () => {
  const [bookDetails, setBookDetails] = useState<Book>();
  const [busy, setBusy] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const { data } = await client.get("/book/details/" + slug);
        setBookDetails(data.book);
        const reviews = await fetchBookReviews(data.book.id);
        setReviews(reviews);
      } catch (error) {
        ParseError(error);
      } finally {
        setBusy(false);
      }
    };

    fetchBookDetail();
  }, [slug]);

  if (busy)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <Skeletons.BookDetails />
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="transition-all duration-300">
            <BookDetail book={bookDetails} />
          </div>

          {/* Related Books Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md overflow-hidden transition-all duration-300">
            <RecommendedSection id={bookDetails?.id} />
          </div>

          {/* Reviews Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md overflow-hidden transition-all duration-300">
            <ReviewSection
              id={bookDetails?.id}
              reviews={reviews}
              title={`${bookDetails?.title} Reviews`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
