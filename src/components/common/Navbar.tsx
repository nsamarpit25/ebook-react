import {
  Navbar as NextUINav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Badge,
} from "@nextui-org/react";
import { FC } from "react";
import { FaBookReader } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ProfileOptions from "../profile/ProfileOptions";
import DarkModeSwitch from "./DarkModeSwitch";
import useCart from "../../hooks/useCart";

interface Props {}

const Navbar: FC<Props> = () => {
  const { totalCount } = useCart();

  return (
    <NextUINav 
      className="x  border-b"
      maxWidth="xl"
    >
      <NavbarBrand>
        <Link 
          to="/" 
          className="flex items-center space-x-3 transition-transform hover:scale-105"
        >
          <FaBookReader 
            size={28} 
            className="text-gray-900 dark:text-gray-100" 
          />
          <p className="font-bold text-xl text-gray-900 dark:text-gray-100">
            Store
          </p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end" className="space-x-4">
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
        
        <NavbarItem>
          <Link 
            to="/cart" 
            className="relative transition-transform hover:scale-110"
          >
            <Badge 
              content={totalCount} 
              color="danger" 
              shape="circle"
              className="font-medium"
            >
              <FaCartShopping 
                size={24} 
                className="text-gray-700 dark:text-gray-300" 
              />
            </Badge>
          </Link>
        </NavbarItem>
        
        <NavbarItem className="flex items-center">
          <ProfileOptions />
        </NavbarItem>
      </NavbarContent>
    </NextUINav>
  );
};

export default Navbar;
