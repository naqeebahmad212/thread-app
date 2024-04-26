import { SignIn } from "@clerk/nextjs";
import React from "react";

const SigninPage = () => {
  return <SignIn path="/sign-in" fallbackRedirectUrl={"/onboarding"} />;
};

export default SigninPage;
