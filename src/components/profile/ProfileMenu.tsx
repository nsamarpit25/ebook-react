import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  DropdownSection,
} from "@nextui-org/react";
import { FC, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Profile } from "../../store/auth";
import { HiOutlineLibrary } from "react-icons/hi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { FiUser, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { IoAnalyticsOutline } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";

interface Props {
  profile: Profile;
  signOut: () => void;
}

interface LinkProps {
  title: string;
  to: string;
  icon?: ReactNode;
}

const DropdownLink: FC<LinkProps> = ({ title, to, icon }) => {
  return (
    <Link
      className="px-2 py-1.5 w-full flex items-center gap-2 group transition-colors duration-300 hover:text-danger"
      to={to}
    >
      {icon && (
        <span className="text-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
      )}
      <span>{title}</span>
    </Link>
  );
};

const ProfileMenu: FC<Props> = ({ profile, signOut }) => {
  const { name, email, role, avatar } = profile;

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: avatar,
              className:
                "bg-gradient-to-r from-primary to-danger transition-transform duration-300 group-hover:scale-105",
            }}
            className="transition-transform duration-300 hover:scale-105 group"
            name={name}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User Actions"
          variant="flat"
          className="backdrop-blur-lg"
        >
          <DropdownSection showDivider>
            <DropdownItem
              key="profile"
              className="h-14 gap-2 opacity-100"
              textValue={email}
            >
              <div className="font-medium">
                <p className="text-default-600">Signed in as</p>
                <p className="text-sm text-danger">{email}</p>
              </div>
            </DropdownItem>
            <DropdownItem key="my_library" className="p-0" textValue="library">
              <DropdownLink
                title="My Library"
                to="/library"
                icon={<HiOutlineLibrary />}
              />
            </DropdownItem>
            <DropdownItem key="orders" className="p-0" textValue="orders">
              <DropdownLink
                title="My Orders"
                to="/orders"
                icon={<RiShoppingBag3Line />}
              />
            </DropdownItem>
          </DropdownSection>

          {role === "author" ? (
            <DropdownSection showDivider>
              <DropdownItem
                key="analytics"
                className="p-0"
                textValue="analytics"
              >
                <DropdownLink
                  title="Analytics"
                  to="/analytics"
                  icon={<IoAnalyticsOutline />}
                />
              </DropdownItem>
              <DropdownItem
                key="create_new_book"
                className="p-0"
                textValue="Create New Book"
              >
                <DropdownLink
                  title="Create New Book"
                  to="/create-new-book"
                  icon={<MdOutlineCreateNewFolder />}
                />
              </DropdownItem>
            </DropdownSection>
          ) : (
            <></>
          )}

          <DropdownSection>
            <DropdownItem key="profile" className="p-0" textValue="profile">
              <DropdownLink title="Profile" to="/profile" icon={<FiUser />} />
            </DropdownItem>
            <DropdownItem
              key="help"
              className="p-0"
              textValue="Help & Feedback"
            >
              <DropdownLink
                title="Help & Feedback"
                to="/help"
                icon={<FiHelpCircle />}
              />
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger flex items-center gap-2 group"
              onClick={signOut}
              textValue="Log Out"
            >
              <FiLogOut className="text-lg group-hover:scale-110 transition-transform duration-300" />
              <span>Log Out</span>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileMenu;
