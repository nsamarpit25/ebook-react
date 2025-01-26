import {
  Badge,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINav,
} from "@nextui-org/react";
import { FC, useState } from "react";
import { FaBookReader } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import MobileNav from "../MobileNav";
import ProfileOptions from "../profile/ProfileOptions";
import SearchForm from "../SearchForm";
import DarkModeSwitch from "./DarkModeSwitch";

interface Props {}

const Navbar: FC<Props> = () => {
  const [showNav, setShowNav] = useState(false);
  const { totalCount } = useCart();
  const { profile, signOut } = useAuth();
  const isAuthor = profile?.role === "author";

  const openNav = () => {
    setShowNav(true);
  };

  const closeNav = () => {
    setShowNav(false);
  };

  return (
    <>
      <NextUINav
        maxWidth="xl"
        position="sticky"
        className="h-[70px] bg-background/60 backdrop-blur-xl border-b border-default-200/50 shadow-lg z-50"
      >
        <NavbarBrand className="h-full items-center basis-1/4">
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 transition-all duration-300 hover:scale-105 group"
            aria-label="Store Home"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-danger rounded-full opacity-25 blur-sm group-hover:opacity-75 transition-opacity duration-300" />
              <FaBookReader
                size={24}
                className="text-primary relative transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="font-bold text-xl bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent hidden md:block">
              Store
            </p>
          </Link>
        </NavbarBrand>

        <NavbarContent
          justify="center"
          className="h-full items-center basis-2/4"
        >
          <SearchForm />
        </NavbarContent>

        <NavbarContent
          justify="end"
          className="h-full items-center gap-4 basis-1/4"
        >
          <NavbarItem className="md:flex hidden">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
              <DarkModeSwitch />
            </div>
          </NavbarItem>
          <NavbarItem className="md:flex hidden">
            <Link
              to="/cart"
              className="flex items-center relative group"
              aria-label={`Shopping cart with ${totalCount} items`}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
              <Badge
                content={totalCount}
                color="danger"
                shape="circle"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <FaCartShopping
                  size={24}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </Badge>
            </Link>
          </NavbarItem>
          <NavbarItem className="md:flex hidden">
            <ProfileOptions />
          </NavbarItem>

          <NavbarItem
            onClick={openNav}
            className="flex md:hidden cursor-pointer"
          >
            <IoMenu size={26} />
          </NavbarItem>
        </NavbarContent>
      </NextUINav>

      <div className="block md:hidden">
        <MobileNav
          isAuthor={isAuthor}
          visible={showNav}
          onClose={closeNav}
          cartTotal={totalCount}
          onLogout={signOut}
          isLoggedIn={profile ? true : false}
        />
      </div>
    </>
  );
};

export default Navbar;
