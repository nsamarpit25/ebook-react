import { FC } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {}

const PaymentSuccess: FC<Props> = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  return <div></div>;
};

export default PaymentSuccess;
