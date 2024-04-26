import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchUserPosts } from "@/lib/actions/user.action";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: {
  currentUserId: string;
  accountId: string;
  accountType: string;
}) => {
  let result: any;
  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result &&
        result.threads.map((post: any) => (
          <ThreadCard
            key={post._id}
            id={post._id}
            currentUserId={currentUserId}
            parentId={post.parentId}
            content={post.text}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: post.author.name,
                    image: post.author.image,
                    id: post.author.id,
                  }
            }
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
          />
        ))}
    </section>
  );
};

export default ThreadsTab;
