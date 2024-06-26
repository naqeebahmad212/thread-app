import { fetchUser, getActivities } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
const Page = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const userInfo = await fetchUser(user?.id as string);
  if (!userInfo || !userInfo.onboardedStatus) redirect("/onboarding");

  const activities = await getActivities(userInfo._id as string);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {(await activities.replies).length > 0 ? (
          <>
            {activities.replies.map((reply: any) => (
              <Link key={reply._id} href={`/thread/${reply.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={reply.author.image}
                    alt={"profile image"}
                    width={20}
                    height={20}
                    className="rounded-full object-cover overflow-hidden"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {reply.author.name}
                    </span>{" "}
                    {""}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}

            {activities.likedThread.map((thread: any) =>
              thread.likes.map((like: any) => (
                <Link key={like._id} href={`/thread/${like.threadId}`}>
                  <article className="activity-card">
                    <Image
                      src={like.user.image}
                      alt={"profile image"}
                      width={20}
                      height={20}
                      className="rounded-full object-cover overflow-hidden"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {like.user.name}
                      </span>{" "}
                      {""}
                      liked your thread
                    </p>
                  </article>
                </Link>
              ))
            )}
          </>
        ) : (
          <p className="!text-base-regular text-light-3"> No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
