import { Badge, Navbar as NextUINav } from "@nextui-org/react";
import { FC, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoMenuOutline } from "react-icons/io5";
import { RiBookOpenLine } from "react-icons/ri";
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
        className="h-[80px] bg-background/95 backdrop-blur-xl border-b border-default-200/50 shadow-md z-[51]"
      >
        <div className="container mx-auto h-full flex items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center h-full">
            <Link
              to="/"
              className="flex items-center gap-3 transition-all duration-300 hover:scale-105 group"
              aria-label="Store Home"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-primary to-danger rounded-full opacity-25 blur-sm group-hover:opacity-75 transition-opacity duration-300" />
                <RiBookOpenLine
                  size={30}
                  className="text-primary relative transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent hidden md:block">
                Store
              </span>
            </Link>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-4 h-full">
            <div className="flex items-center">
              <SearchForm />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 h-full">
              {/* Theme Toggle */}
              <div className="relative group">
                <button className="p-3 rounded-full hover:bg-content2/50 backdrop-blur-sm transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                  <DarkModeSwitch />
                </button>
              </div>

              {/* Cart */}
              <div className="relative group">
                <Link
                  to="/cart"
                  className="p-3 rounded-full hover:bg-content2/50 backdrop-blur-sm transition-colors flex items-center justify-center"
                  aria-label={`Shopping cart with ${totalCount} items`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                  <Badge
                    content={totalCount}
                    color="danger"
                    shape="circle"
                    size="lg"
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    <HiOutlineShoppingBag size={24} className="stroke-[1.5]" />
                  </Badge>
                </Link>
              </div>

              {/* Profile */}
              <div className="relative group">
                <ProfileOptions />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={openNav}
                className="p-3 hover:bg-content2/50 backdrop-blur-sm rounded-full transition-colors relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-danger/20 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                <IoMenuOutline size={24} />
              </button>
            </div>
          </div>
        </div>
      </NextUINav>

      {/* Mobile Navigation */}
      <div className="block md:hidden">
        <MobileNav
          isAuthor={isAuthor}
          visible={showNav}
          onClose={closeNav}
          cartTotal={totalCount}
          onLogout={signOut}
          isLoggedIn={!!profile}
        />
      </div>
    </>
  );
};

export default Navbar;
