"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  ArrowUpIcon,
  ImageUp,
  ChartNoAxesColumn,
  Loader,
  Circle,
  Plus,
  X,
} from "lucide-react";
import { IconPlus } from "@tabler/icons-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { capitalize, size } from "lodash";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Input } from "@/components/ui/input";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Updater, useImmer } from "use-immer";

import { useShell } from "@/shell/shell";

import { v4 } from "uuid";

import Image from "next/image";

interface Question {
  id: string;
  question: string;
  vote: number;
}

interface Poll {
  id: string;
  questions: Question[];
  duration: string;
  style: "single" | "multiple";
}

interface Post {
  id: string;
  content: string;
  poll?: Poll;
  images?: string[];
  privacy: "public" | "private";
  comments: number;
  boosts: number;
  favorites: number;
  createdBy: string;
  createdAt: string;
}

export default function Page() {
  const { supabase, user } = useShell();
  const [text, setText] = useState<string>("");
  const [poll, setPoll] = useImmer<Poll | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templatePool: Poll = {
    id: v4(),
    questions: [
      { id: v4(), question: "", vote: 0 },
      { id: v4(), question: "", vote: 0 },
    ],
    duration: "0:1:0",
    style: "single",
  };

  const maxCount = 500;
  const maxImages = 4;

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    setUploading(true);

    try {
      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      const uploadPromises = filesToUpload.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${v4()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePoll = () => {
    if (!poll) {
      setPoll(templatePool);
      setImages([]);
    } else {
      setPoll(undefined);
    }
  };

  const handlePost = async () => {
    if (!text.trim() && images.length === 0) return;

    setPosting(true);

    try {
      const postData: Post = {
        id: v4(),
        content: text,
        poll: poll,
        images: images,
        privacy: "public",
        comments: 0,
        boosts: 0,
        favorites: 0,
        createdBy: user?.id || "",
        createdAt: new Date().toISOString(),
      };

      const { error } = await supabase.from("posts").insert([postData]);

      if (error) throw error;

      // Reset form
      setText("");
      setImages([]);
      setPoll(undefined);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="p-3 grid gap-4">
      <ItemAvatar
        user={{
          fullName: user?.user_metadata.full_name,
          avatarUrl: user?.user_metadata.avatar_url,
          username: user?.user_metadata.username,
        }}
      />
      <InputGroup className="outline-none border-none focus:outline-none focus:border-none">
        <InputGroupTextarea
          placeholder="Share your thought, promote your product, or ask questions."
          value={text}
          ref={inputRef}
          className="min-h-25 pl-4"
          onChange={(ev) => {
            let newVal = ev.target.value;
            if (newVal.length <= maxCount) setText(newVal);
            else if (newVal.length > maxCount) return;
          }}
        />
        <InputGroupAddon align={"block-start"}>
          <InputGroupButton variant={"outline"}>
            Public, anyone can quote
          </InputGroupButton>
          <InputGroupButton variant={"outline"}>English</InputGroupButton>
        </InputGroupAddon>

        {poll && <PollInt poll={poll} setPoll={setPoll} />}

        {images.length > 0 && !poll && (
          <ImagePreview images={images} onRemove={removeImage} />
        )}

        <InputGroupAddon align="block-end">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <InputGroupButton
            size="icon-xs"
            disabled={!!poll || images.length >= maxImages || uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? <Loader className="animate-spin" /> : <ImageUp />}
          </InputGroupButton>
          <InputGroupButton
            variant={`${poll ? "default" : "outline"}`}
            size={"icon-xs"}
            onClick={togglePoll}
            disabled={images.length > 0}
          >
            <ChartNoAxesColumn />
          </InputGroupButton>
          <InputGroupText className="ml-auto">
            {maxCount - text?.length}
          </InputGroupText>
          <Separator orientation="vertical" className="h-4!" />
          <InputGroupButton
            variant="default"
            className="w-25"
            disabled={(!text.length && images.length === 0) || posting}
            onClick={handlePost}
          >
            {posting ? <Loader className="animate-spin" /> : <span>Post</span>}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function ImagePreview({
  images,
  onRemove,
}: {
  images: string[];
  onRemove: (index: number) => void;
}) {
  const gridClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
      ? "grid-cols-2"
      : images.length === 3
      ? "grid-cols-3"
      : "grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-2 w-full px-2 pb-4`}>
      {images.map((url, index) => (
        <div key={index} className="relative group aspect-square">
          {/* <img
            src={url}
            alt={`Upload ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          /> */}
          <Image
            src={url}
            alt={`Upload ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
            width={300}
            height={300}
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}

function PollInt({
  poll,
  setPoll,
}: {
  poll: Poll;
  setPoll: Updater<Poll | undefined>;
}) {
  const [questions, setQuestions] = useImmer<Question[]>(poll.questions);

  useEffect(() => {
    setPoll((draft) => {
      if (draft) {
        draft.questions = questions;
      }
    });
  }, [questions, setPoll]);

  const handleQuestions = (
    event: ChangeEvent<HTMLInputElement>,
    question: Question,
    posn: number
  ) => {
    let value = event.target.value;
    let MAX_COUNT = 50;

    setQuestions((draft) => {
      const currQuestion = draft.find((q) => q.id === question.id);

      if (currQuestion && value.length <= MAX_COUNT) {
        currQuestion.question = value;
        if (posn > 1 && posn < 4 && draft.length <= posn) {
          draft.push({ id: v4(), question: "", vote: 0 });
        }
      }

      if (currQuestion && value.length === 0 && draft.length > 2) {
        draft.filter((q) => q.id !== currQuestion.id);
      }
    });
  };

  return (
    <div className="grid gap-3 w-full px-2 pb-4">
      <ul className="grid gap-3">
        {questions.map((question, index) => {
          return (
            <li key={question.id} className="flex gap-2 items-center">
              <Circle color="gray" />
              <Input
                id={question.id}
                type="text"
                value={question.question}
                onChange={(event) =>
                  handleQuestions(event, question, index + 1)
                }
                placeholder={`Option ${index + 1}`}
              />
            </li>
          );
        })}
      </ul>
      <div className="flex justify-around text-gray-400">
        <div>
          <p className="text-xs">Poll duration</p>
          <select
            className="appearance-none text-blue-400 outline-none"
            onChange={(event) => {
              setPoll((draft) => {
                if (draft) {
                  draft.duration = event.target.value;
                }
              });
            }}
          >
            <option value="0:0:5">5 minutes</option>
            <option value="0:0:30">30 minutes</option>
            <option value="0:1:0">1 hour</option>
            <option value="0:6:0">6 hours</option>
            <option value="0:12:0">12 hours</option>
            <option value="1:0:0">1 day</option>
            <option value="3:0:0">3 days</option>
            <option value="7:0:0">7 days</option>
          </select>
        </div>
        <div>
          <p className="text-xs">Style</p>
          <select
            className="appearance-none outline-none text-blue-400"
            onChange={(event) => {
              setPoll((draft) => {
                let value = event.target.value;
                if (value === "single" || value === "multiple") {
                  if (draft) {
                    draft.style = value;
                  }
                }
              });
            }}
          >
            <option value="single">Single choice</option>
            <option value="multiple">Multiple choices</option>
          </select>
        </div>
      </div>
    </div>
  );
}

interface User {
  fullName: string;
  avatarUrl: string | null;
  username: string | null;
}

export function ItemAvatar({ user }: { user: User }) {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item>
        <ItemMedia>
          <Avatar className="size-10">
            <AvatarImage
              src={user.avatarUrl || "https://github.com/evilrabbit.png"}
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{user.fullName}</ItemTitle>
          <ItemDescription>@{user.username || "star"}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
