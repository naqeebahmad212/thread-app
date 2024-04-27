"use client";
import { addLikeToThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Like = ({
  id,
  currentUserId,
  isLiked,
  isOnboarded,
}: {
  id: string;
  currentUserId: string;
  isLiked: boolean;
  isOnboarded: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      {isLiked ? (
        <Image
          src="/assets/heart-filled.svg"
          alt="liked"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      ) : (
        <Image
          src="/assets/heart-gray.svg"
          alt="like"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
          onClick={async () => {
            if (!currentUserId) return;

            if (!isOnboarded) {
              router.push("/onboarding");
            }
            await addLikeToThread(id, currentUserId, pathname);
          }}
        />
      )}
    </>
  );
};

export default Like;
