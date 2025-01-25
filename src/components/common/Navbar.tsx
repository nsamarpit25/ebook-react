import {
  Badge,
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
      <NextUINav maxWidth="xl" position="sticky">
        <NavbarContent className="w-full" justify="center">
          <div className="flex items-center gap-4 w-full max-w-[800px]">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 shrink-0"
              aria-label="Store Home"
            >
              <FaBookReader size={24} />
              <p className="font-bold text-inherit hidden md:block">Store</p>
            </Link>
            <SearchForm />
          </div>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="md:flex hidden">
            <DarkModeSwitch />
          </NavbarItem>
          <NavbarItem className="md:flex hidden">
            <Link
              to="/cart"
              aria-label={`Shopping cart with ${totalCount} items`}
            >
              <Badge content={totalCount} color="danger" shape="circle">
                <FaCartShopping size={24} />
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
