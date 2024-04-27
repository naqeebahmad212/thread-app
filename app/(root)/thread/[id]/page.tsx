import ThreadCard from "@/components/cards/ThreadCard";
import Comments from "@/components/forms/Comments";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import Thread from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const ThreadDetailsPage = async ({ params }: { params: { id: string } }) => {
  const post = await fetchThreadById(params.id);
  const user = await currentUser();
  const userInfo = await fetchUser(user?.id || "");

  if (userInfo && userInfo.onboardedStatus !== true) redirect("/onboarding/");
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={post._id}
          id={post._id}
          currentUserId={user?.id || ""}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
          likes={post.likes}
        />
      </div>
      <div className="mt-7">
        <Comments
          threadId={post._id}
          currentUserImg={userInfo?.image || user?.imageUrl}
          currentUserId={JSON.stringify(userInfo?._id) || ""}
        />
      </div>

      <div className="mt-10">
        {post.children.length > 0 &&
          post.children.map((comment: any) => (
            <ThreadCard
              key={comment._id}
              id={comment._id}
              currentUserId={user?.id || ""}
              parentId={comment.parentId}
              content={comment.text}
              author={comment.author}
              community={comment.community}
              createdAt={comment.createdAt}
              comments={comment.children}
              likes={comment.likes}
              isComment={true}
              className="mt-7"
            />
          ))}
      </div>
    </section>
  );
};

export default ThreadDetailsPage;
