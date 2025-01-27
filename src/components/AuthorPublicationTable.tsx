import {
  Button,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaBook, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import { ParseError } from "../utils/helper";
import type { BookDetail } from "../views/Library";

interface Props {}

const AuthorPublicationTable: FC<Props> = () => {
  const { profile } = useAuth();
  const [fetching, setFetching] = useState(false);
  const [createdBooks, setCreatedBooks] = useState<BookDetail[]>([]);
  const [removingId, setRemovingId] = useState("");
  const [bookToDelete, setBookToDelete] = useState<BookDetail | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteClick = (book: BookDetail) => {
    setBookToDelete(book);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;

    try {
      setRemovingId(bookToDelete.id);
      const { data } = await client.delete(`/book/${bookToDelete.id}`);

      if (data.success) {
        toast.success("Book removed successfully");
        setCreatedBooks((prev) =>
          prev.filter((book) => book.id !== bookToDelete.id)
        );
        onClose();
      } else {
        setDeleteError(
          "Unable to delete book. It may be purchased or have other dependencies."
        );
      }
    } catch (error) {
      ParseError(error);
      setDeleteError("An error occurred while deleting the book.");
    } finally {
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
                <div className="flex justify-end gap-2">
                  <Button
                    as={Link}
                    to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                    size="sm"
                    color="primary"
                    variant="flat"
                    isDisabled={removingId === book.id}
                  >
                    Read
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(book)}
                    size="sm"
                    color="danger"
                    variant="bordered"
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
                    isDisabled={removingId === book.id}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          base: "border border-divider bg-content1",
          header: "border-b border-divider",
          body: "py-6",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Confirm Delete</h3>
          </ModalHeader>
          <ModalBody>
            {deleteError ? (
              <div className="space-y-4">
                <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
                  <p className="text-danger">{deleteError}</p>
                </div>
                <div className="text-sm text-foreground-500">
                  <p>Possible reasons:</p>
                  <ul className="list-disc ml-4 mt-2 space-y-1">
                    <li>Book has been purchased by users</li>
                    <li>Book was created before this feature was introduced</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-foreground-600">
                Are you sure you want to delete "{bookToDelete?.title}"? This
                action cannot be undone.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                onClose();
                setDeleteError("");
              }}
            >
              Cancel
            </Button>
            {!deleteError && (
              <Button
                color="danger"
                variant="flat"
                onPress={handleDeleteConfirm}
                isLoading={!!removingId}
              >
                Delete Book
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AuthorPublicationTable;
