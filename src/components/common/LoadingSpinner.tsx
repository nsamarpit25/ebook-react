import { Spinner } from "@nextui-org/react";
import { FC } from "react";

interface Props {}

const LoadingSpinner: FC<Props> = () => {
  return (
    <div className="flex justify-center items-center p-10">
      <Spinner label="Verifying...." color="warning" />
    </div>
  );
};

export default LoadingSpinner;
