import { Button, Badge } from "@nextui-org/react";
import { FC } from "react";
import { FaBookReader, FaUser } from "react-icons/fa";
import { FaCartShopping, FaBook, FaBoxOpen } from "react-icons/fa6";
import { Link } from "react-router-dom";
import DarkModeSwitch from "./common/DarkModeSwitch";

interface Props {
  visible: boolean;
  onClose(): void;
  onLogout(): void;
  cartTotal?: number | string;
  isAuthor?: boolean;
  isLoggedIn: boolean;
}

const MobileNav: FC<Props> = ({
  isAuthor = false,
  cartTotal,
  visible,
  isLoggedIn,
  onClose,
  onLogout,
}) => {
  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-[250px] bg-background shadow-xl transform transition-transform duration-300 ease-in-out z-[100] ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-divider">
            <Link onClick={onClose} to="/" className="flex items-center gap-2">
              <FaBookReader size={20} />
              <span className="font-medium">Store</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link onClick={onClose} to="/cart">
                <Badge content={cartTotal} color="danger" size="sm">
                  <FaCartShopping size={18} />
                </Badge>
              </Link>
              <DarkModeSwitch />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="px-3 space-y-1">
                  <Button
                    as={Link}
                    to="/profile"
                    variant="light"
                    startContent={
                      <FaUser className="text-default-500" size={16} />
                    }
                    onClick={onClose}
                    fullWidth
                    className="justify-start h-11"
                    radius="sm"
                  >
                    Profile
                  </Button>
                  <Button
                    as={Link}
                    to="/orders"
                    variant="light"
                    startContent={
                      <FaBoxOpen className="text-default-500" size={16} />
                    }
                    onClick={onClose}
                    fullWidth
                    className="justify-start h-11"
                    radius="sm"
                  >
                    Orders
                  </Button>
                  <Button
                    as={Link}
                    to="/library"
                    variant="light"
                    startContent={
                      <FaBook className="text-default-500" size={16} />
                    }
                    onClick={onClose}
                    fullWidth
                    className="justify-start h-11"
                    radius="sm"
                  >
                    Library
                  </Button>
                  {isAuthor && (
                    <Button
                      as={Link}
                      to="/create-new-book"
                      variant="light"
                      startContent={
                        <FaBookReader className="text-default-500" size={16} />
                      }
                      onClick={onClose}
                      fullWidth
                      className="justify-start h-11"
                      radius="sm"
                    >
                      Create New Book
                    </Button>
                  )}
                </div>

                <div className="px-3 pt-4 border-t border-divider">
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      onLogout();
                      onClose();
                    }}
                    fullWidth
                    className="h-11"
                    radius="sm"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-3">
                <Button
                  as={Link}
                  to="sign-up"
                  color="primary"
                  onClick={onClose}
                  fullWidth
                  className="h-11"
                  radius="sm"
                >
                  Sign Up / In
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          visible ? "opacity-100 visible" : "opacity-0 invisible"
        } z-[99]`}
      />
    </>
  );
};

export default MobileNav;
