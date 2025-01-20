import { Button, Card } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import RichEditor from "../components/rich-editor";
import toast from "react-hot-toast";
import client from "../api/client";
import { ParseError } from "../utils/helper";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { AxiosError } from "axios";

interface Props {}

const ReviewForm: FC<Props> = () => {
  const [selectedRating, setSelectedRating] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { bookId } = useParams();
  const ratings = Array(5).fill("");

  const updateRatingChanges = (rating: number) => {
    const ratings: Array<string> = Array(rating).fill("selected");
    setSelectedRating(ratings);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();

    if (!selectedRating.length) return toast.error("Please select some rating");

    try {
      setLoading(true);
      await client.post("/review", {
        bookId,
        rating: selectedRating.length,
        content,
      });
      toast.success("Thanks for submitting your review");
    } catch (error) {
      if (error instanceof AxiosError) {
        // if (error.response?.status === 404) {
        //   return;
        // }
      }
      ParseError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data } = await client.get("/review/" + bookId);
        setContent(data.content || "");
        updateRatingChanges(data.rating);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            return;
          }
          ParseError(error)
        }
      } finally {
        setFetching(false);
      }
    };
    fetchReview();
  }, [bookId]);

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="container max-w-4xl mx-auto p-6 lg:p-8 min-h-[80vh] flex items-center">
      <Card className="p-8 bg-white dark:bg-gray-800 shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Write a Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <p className="text-base font-medium mb-4 text-gray-600 dark:text-gray-400">
              How would you rate this book?
            </p>
            <div className="flex gap-3">
              {ratings.map((_, index) => (
                <Button
                  key={index}
                  isIconOnly
                  variant="light"
                  radius="full"
                  onClick={() => updateRatingChanges(index + 1)}
                  className={`transition-all duration-200 hover:scale-110 p-3 ${
                    selectedRating[index] === "selected"
                      ? "text-yellow-400"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {selectedRating[index] === "selected" ? (
                    <FaStar size={32} className="transform-gpu" />
                  ) : (
                    <FaRegStar size={32} className="transform-gpu" />
                  )}
                </Button>
              ))}
            </div>
            {!selectedRating.length && (
              <p className="text-sm text-red-500 mt-3">
                Please select a rating
              </p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-base font-medium text-gray-600 dark:text-gray-400">
              Share your thoughts about this book
            </p>
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <RichEditor
                value={content}
                onChange={setContent}
                editable
                placeholder="What did you think about this book? What did you like or dislike?"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              isLoading={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 px-10"
              size="lg"
              radius="full"
              startContent={
                !loading && <FaStar className="text-yellow-300" size={20} />
              }
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReviewForm;
