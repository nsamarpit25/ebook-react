import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  divider,
} from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaBook, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import { ParseError } from "../utils/helper";
import type { BookDetail } from "../views/Library";
import toast from "react-hot-toast";

interface Props {}

const AuthorPublicationTable: FC<Props> = () => {
  const { profile } = useAuth();
  const [fetching, setFetching] = useState(false);
  const [createdBooks, setCreatedBooks] = useState<BookDetail[]>([]);
  const [removeRequestId, setRemoveRequestId] = useState("");
  const [removingId, setRemovingId] = useState("");

  const handleOnConfirmRemove = async () => {
    try {
      setRemovingId(removeRequestId);
      const { data } = await client.delete(`/book/${removeRequestId}`);
      if (data.success) {
        toast.success("Book removed successfully");
        setCreatedBooks((prev) =>
          prev.filter((book) => book.id !== removeRequestId)
        );
      } else {
        toast.error(
          (t) => (
            <div className="space-y-2">
              <span>We could not remove your book</span>
              <li>Possible reasons:</li>
              <li>- Book is purchased by someone</li>
              <li>- Your content does not support this feautre</li>
              <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>{" "}
            </div>
          ),
          { duration: 10000 }
        );
      }
    } catch (error) {
      ParseError(error);
    } finally {
      setRemoveRequestId("");
      setRemovingId("");
    }
  };

  useEffect(() => {
    if (profile?.authorId) {
      const fetchCreatedBooks = async () => {
        try {
          setFetching(true);
          const { data } = await client.get(
            `/author/books/${profile.authorId}`
          );
          setCreatedBooks(data.books);
        } catch (error) {
          ParseError(error);
        } finally {
          setFetching(false);
        }
      };
      fetchCreatedBooks();
    }
  }, [profile?.authorId]);

  if (fetching) {
    return (
      <div className="container mx-auto max-w-7xl py-12 px-6 space-y-8">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="w-full h-[280px] rounded-2xl bg-background/60 backdrop-blur-sm"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Published Books</h3>
        <Button
          as={Link}
          to="/create-new-book"
          className="bg-primary text-white shadow-sm hover:opacity-90"
          startContent={<FaPlus />}
        >
          Create New Book
        </Button>
      </div>

      <Table
        removeWrapper
        aria-label="Books table"
        classNames={{
          base: "border border-divider rounded-xl overflow-hidden",
          thead: "bg-default-100/50",
          th: "text-default-600 text-xs font-medium tracking-wide uppercase py-4",
          tr: "[&:not(:last-child)]:border-b border-divider",
          td: "py-4",
        }}
      >
        <TableHeader>
          <TableColumn>Book</TableColumn>
          <TableColumn>Details</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {createdBooks.map((book) => (
            <TableRow key={book.id} className="group">
              <TableCell>
                <div className="w-16 h-24 relative overflow-hidden rounded-lg">
                  {book.cover ? (
                    <Link to={`/book/${book.slug}`}>
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transform transition group-hover:scale-110"
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-full bg-default-100 flex items-center justify-center">
                      <FaBook className="text-default-300" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-lg tracking-tight bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300">
                    <Link to={`/book/${book.slug}`}>{book.title}</Link>
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className={
                    book.status === "published"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }
                  size="sm"
                  variant="flat"
                >
                  {book.status === "published" ? "Published" : "Draft"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2 relative">
                  {removeRequestId === book.id && (
                    <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
                      <button
                        onMouseDown={() => {
                          handleOnConfirmRemove();
                        }}
                        onBlur={() => setRemoveRequestId("")}
                        className="underline"
                      >
                        Please confirm before removing
                      </button>
                    </div>
                  )}
                  <Button
                    as={Link}
                    to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                    size="sm"
                    color="primary"
                    variant="flat"
                    isLoading={removingId === book.id}
                  >
                    Check
                  </Button>
                  <Button
                    onClick={() => setRemoveRequestId(book.id)}
                    size="sm"
                    variant="bordered"
                    color="danger"
                    startContent={<FaTrashAlt />}
                    isLoading={removingId === book.id}
                  >
                    Delete
                  </Button>
                  <Button
                    as={Link}
                    to={`/update-book/${book.slug}`}
                    size="sm"
                    variant="bordered"
                    isLoading={removingId === book.id}
                    startContent={<FaEdit />}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuthorPublicationTable;
