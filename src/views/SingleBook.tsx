import { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, slug]);

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4">
          <Skeletons.BookDetails />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-8">
          <div className="transition-all duration-300">
            <BookDetail book={bookDetails} />
          </div>

          {/* Related Books Section */}
          <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg">
            <RecommendedSection id={bookDetails?.id} />
          </div>

          {/* Reviews Section */}
          <div className="bg-content1/50 backdrop-blur-lg rounded-2xl shadow-lg">
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
