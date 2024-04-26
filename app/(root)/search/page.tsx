import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user?.id as string);

  if (!userInfo || !userInfo.onboardedStatus) redirect("/onboarding");

  //   fetch all users

  const result = await fetchUsers({
    userId: user.id,
    searchTerm: "",
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      {/* todo searchbar */}
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {result && result.userQuery.length == 0 ? (
          <div className="no-result">No result</div>
        ) : (
          result &&
          result.userQuery.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              username={user.username}
              imgUrl={user.image}
              personType="User"
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
