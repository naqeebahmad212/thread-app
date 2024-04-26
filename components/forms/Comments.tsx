"use client";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { commentValidation } from "@/lib/validation/thread";
import { addCommentToThread } from "@/lib/actions/thread.action";
import { Input } from "../ui/input";
import Image from "next/image";
import { useTransition } from "react";
interface Props {
  threadId: string;
  currentUserImg: string | null;
  currentUserId: string;
}

const Comments = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    startTransition(async () => {
      await addCommentToThread(
        threadId,
        values.thread,
        JSON.parse(currentUserId),
        pathname
      );
      !pending && form.reset();
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form ">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                <Image
                  src={currentUserImg || ""}
                  alt="Profile"
                  className="rounded-full object-cover"
                  width={48}
                  height={48}
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Write a comment..."
                  className=" no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          {pending ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </Form>
  );
};

export default Comments;
