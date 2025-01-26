import { Button, Badge } from "@nextui-org/react";
import { FC } from "react";
import { RiBookOpenLine } from "react-icons/ri";
import {
  HiOutlineShoppingBag,
  HiUserCircle,
  HiClipboard,
  HiBookOpen,
  HiPlusCircle,
} from "react-icons/hi2";
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
        className={`fixed inset-y-0 right-0 w-[250px] bg-background/95 backdrop-blur-sm shadow-xl
          transform transition-transform duration-300 ease-in-out z-[100]
          ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b border-divider">
            <Link
              onClick={onClose}
              to="/"
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                <Link to="/">
                  <RiBookOpenLine size={24} className="text-primary relative" />
                </Link>
              </div>
              <span className="font-medium bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                Store
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link onClick={onClose} to="/cart" className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-danger/10 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
                <Badge
                  content={cartTotal}
                  color="danger"
                  size="sm"
                  className="transition-transform duration-300 group-hover:scale-110"
                >
                  <HiOutlineShoppingBag size={24} className="stroke-[1.5]" />
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
                      <HiUserCircle className="text-primary" size={20} />
                    }
                    onClick={onClose}
                    fullWidth
                    className="justify-start h-11 hover:bg-primary/10 transition-colors"
                    radius="sm"
                  >
                    Profile
                  </Button>
                  <Button
                    as={Link}
                    to="/orders"
                    variant="light"
                    startContent={
                      <HiClipboard className="text-primary" size={20} />
                    }
                    onClick={onClose}
                    fullWidth
                    className="justify-start h-11 hover:bg-primary/10 transition-colors"
                    radius="sm"
                  >
                    Orders
                  </Button>
                  <Button
                    as={Link}
                    to="/library"
                    variant="light"
                    startContent={
                      <HiBookOpen className="text-primary" size={20} />
                    }
                    onClick={onClose}
                    fullWidth
                    className="justify-start h-11 hover:bg-primary/10 transition-colors"
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
                        <HiPlusCircle className="text-primary" size={20} />
                      }
                      onClick={onClose}
                      fullWidth
                      className="justify-start h-11 hover:bg-primary/10 transition-colors"
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
                    className="h-11 bg-gradient-to-r from-primary to-danger text-white shadow-lg
                      hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
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
                  fullWidth
                  className="h-11 bg-gradient-to-r from-primary to-danger text-white shadow-lg
                    hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
                  radius="sm"
                  onClick={onClose}
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
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300
          ${visible ? "opacity-100 visible" : "opacity-0 invisible"} z-[99]`}
      />
    </>
  );
};

export default MobileNav;
