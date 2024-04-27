import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import DeleteThread from "../forms/DeleteThread";
import { addLikeToThread } from "@/lib/actions/thread.action";
import Like from "../Like";
import { fetchUser } from "@/lib/actions/user.action";

interface ThreadCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;

  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  className?: string;
  path?: string;
  likes: {
    user: string;
    thread: string;
  }[];
}

const ThreadCard = async ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  className,
  path,
  likes,
}: ThreadCardProps) => {
  const userInfo = await fetchUser(currentUserId);
  let isLiked = false;
  let isOnboarded = false;
  if (userInfo) {
    likes.forEach((like) => {
      if (JSON.stringify(like.user) === JSON.stringify(userInfo._id)) {
        isLiked = true;
      }
    });
  }
  if (userInfo) isOnboarded = userInfo?.onboardedStatus;

  return (
    <article
      className={`${className}  flex w-full flex-col  rounded-xl ${
        isComment ? "px-0 xs:px-7" : " bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start  justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author.id} `}
              className="cursor-pointer h-11 w-11 relative"
            >
              <Image
                src={author.image}
                alt="profile"
                fill
                className=" rounded-full object-cover"
              />
            </Link>
            <div className="thread-card_bar"></div>
          </div>

          <div className="flex w-full flex-col">
            <Link
              href={`/profile/${author.id} `}
              className="cursor-pointer w-fit"
            >
              <h4 className="text-base-semibold text-light-1">{author.name}</h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Like
                  id={id}
                  currentUserId={currentUserId}
                  isLiked={isLiked}
                  isOnboarded={isOnboarded}
                />

                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />

                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              <div className="flex items-center gap-3 text-subtle-medium text-gray-1 ">
                {likes.length > 0 && (
                  <p className="mt-1">{likes.length} Likes</p>
                )}
                {comments.length > 0 && (
                  <p className="mt-1 ">{comments.length} replies</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />

        {/* {to do delete thread} */}
        {/* {to do comment logos} */}
      </div>
      {!isComment && community && (
        <Link
          href={`/communties/${community.id}`}
          className="flex mt-5 items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}-{community.name} Community
          </p>
          <Image
            src={community.image}
            alt="community"
            width={14}
            height={14}
            className="ml-1 rounded-full object-contain"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
