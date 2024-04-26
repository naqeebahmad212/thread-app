import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
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

  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
  });

  return (
    <section>
      {/* todo searchbar */}
      <h1 className="head-text mb-10">Communities</h1>
      <div className="mt-14 flex flex-col gap-9">
        {result && result.communities.length == 0 ? (
          <div className="no-result">No result</div>
        ) : (
          result &&
          result.communities.map((community) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              imgUrl={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;
