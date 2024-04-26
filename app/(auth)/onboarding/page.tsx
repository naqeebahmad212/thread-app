import AccountProfile from "@/components/forms/AccountProfile";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Onboarding = async () => {
  const user = await currentUser();
  const userData = {
    id: user?.id || "",
    username: user?.username || "",
    name: user?.firstName || "",
    bio: "",
    image: user?.imageUrl || "",
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>
      <section className="mt-9 p-10 bg-dark-2">
        {userData && <AccountProfile user={userData} btnTitle="Continue" />}
      </section>
    </main>
  );
};

export default Onboarding;
