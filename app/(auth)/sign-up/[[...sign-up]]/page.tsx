import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return <SignUp path="/sign-up" fallbackRedirectUrl={"/sign-in"} />;
};

export default Page;
