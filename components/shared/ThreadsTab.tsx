import { fetchUserPosts } from "@/lib/actions/thread.action";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: {
  currentUserId: string;
  accountId: string;
  accountType: string;
}) => {
  // TODO: fetch profile threads
  let result = await fetchUserPosts(accountId);
  //   if (!result) redirect("/");
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
