"use client";

import { deleteThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <>
      {!pending ? (
        <Image
          src="/assets/delete.svg"
          alt="delte"
          width={18}
          height={18}
          className="cursor-pointer object-contain"
          onClick={async () => {
            startTransition(async () => {
              await deleteThread(JSON.parse(threadId), pathname);
            });
            if (!parentId || !isComment) {
              //   router.push("/");
            }
          }}
        />
      ) : (
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      )}
    </>
  );
}

export default DeleteThread;
