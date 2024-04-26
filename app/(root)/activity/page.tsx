import { fetchUser, getActivities } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user?.id as string);

  const activities = await getActivities(userInfo._id as string);
  if (!userInfo || !userInfo.onboardedStatus) redirect("/onboarding");
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {(await activities).length > 0 ? (
          <>
            {activities.map((activity: any) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt={"profile image"}
                    width={20}
                    height={20}
                    className="rounded-full object-cover overflow-hidden"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    {""}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3"> No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
