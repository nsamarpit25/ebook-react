import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import BookDetail, { Book } from "../components/BookDetail";

import ReviewSection, { Review } from "../components/ReviewSection";
import Skeletons from "../components/Skeletons";
import RecommendedSection from "../components/RecommendedSection";

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

  if (busy) return <Skeletons.BookDetails />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <BookDetail book={bookDetails} />
        <RecommendedSection id={bookDetails?.id} />
        <ReviewSection
          id={bookDetails?.id}
          reviews={reviews}
          title={`${bookDetails?.title} Reviews`}
        />
      </div>
    </div>
  );
};

export default SingleBook;
