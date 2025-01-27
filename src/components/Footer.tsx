import { Link } from "@nextui-org/react";
import { FC } from "react";

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <footer className="w-full py-4 px-4 mt-auto">
      <div className="container mx-auto flex justify-center items-center text-xs text-foreground/60">
        <p>
          Made with ♥ by{" "}
          <Link
            href="https://github.com/nsamarpit25"
            target="_blank"
            className="font-medium relative inline-block group"
          >
            <span className="group-hover:text-primary transition-colors duration-300 text-primary-200">
              Samarpit
            </span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-primary to-danger group-hover:w-full transition-all duration-300" />
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
