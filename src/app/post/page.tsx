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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  ArrowUpIcon,
  ImageUp,
  ChartNoAxesColumn,
  Loader,
  Circle,
  Plus,
  X,
  ChevronsUpDown,
  LockKeyhole,
  Globe,
  Moon,
} from "lucide-react";
import { IconPlus } from "@tabler/icons-react";

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
import { Select } from "@/components/ui/select";

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

  const maxCount = 500;
  const maxImages = 4;

  // privacy
  const [privacy, setPrivacy] = useState<"public" | "private">("public");

  const POST_ID = v4();

  const templatePool: Poll = {
    id: v4(),
    questions: [
      { id: v4(), question: "", vote: 0 },
      { id: v4(), question: "", vote: 0 },
    ],
    duration: "1 day",
    style: "single",
  };

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
        // how to retrieve image from a particular post
        const fileName = `${POST_ID}.${fileExt}`;
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

    let postInserted = false;
    let pollInserted = false;

    try {
      const postData = {
        id: POST_ID,
        content: text,
        images: images,
        privacy: privacy,
        comments: 0,
        boosts: 0,
        favorites: 0,
        created_by: user?.id || "", // sharp
        created_at: new Date().toISOString(),
      };

      const { error: postError } = await supabase
        .from("posts")
        .insert([postData]);

      if (postError) throw postError;
      postInserted = true;

      if (poll) {
        const pollData = {
          id: poll.id,
          post_id: POST_ID,
          duration: poll.duration,
          style: poll.style,
        };

        const { error: pollError } = await supabase
          .from("polls")
          .insert([pollData]);

        if (pollError) throw pollError;
        pollInserted = true;

        const questionsData = poll.questions
          .filter((q) => q.question.trim())
          .map((q) => ({
            id: q.id,
            poll_id: poll.id,
            question: q.question,
            vote: q.vote,
          }));

        const { error: questionsError } = await supabase
          .from("poll_questions")
          .insert(questionsData);

        if (questionsError) throw questionsError;
      }
      // so the behavior is that after successful upload, user is redirect to home
      // sharp...

      setText("");
      setImages([]);
      setPoll(undefined);

      // Redirect here... sharp. Makes
    } catch (error) {
      console.error("Error creating post:", error);

      if (pollInserted) {
        await supabase.from("polls").delete().eq("id", poll?.id);
      }

      if (postInserted) {
        await supabase.from("posts").delete().eq("id", POST_ID);
      }

      alert("Failed to create post. Please try again.");
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
      <Drawer>
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
            <DrawerTrigger>
              <InputGroupButton className="text-blue-500" variant={"outline"}>
                {capitalize(privacy)}
              </InputGroupButton>
            </DrawerTrigger>
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
              {posting ? (
                <Loader className="animate-spin" />
              ) : (
                <span>Post</span>
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <DrawerTab privacy={privacy} setPrivacy={setPrivacy} />
      </Drawer>
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
            className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 rounded-full p-1  group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
            {/* Remove */}
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
            <option value="5 minutes">5 minutes</option>
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="6 hours">6 hours</option>
            <option value="12 hours">12 hours</option>
            <option value="1 day" selected>
              1 day
            </option>
            <option value="3 days">3 days</option>
            <option value="7 days">7 days</option>
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

function DrawerTab({ privacy, setPrivacy }: { privacy: any; setPrivacy: any }) {
  return (
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle className="text-left w-full pb-4 mb-7 border-b">
          Visibility and interaction
        </DrawerTitle>
        {/* <Separator /> */}
        <DrawerDescription className="text-left">
          Control who can interact with this post.
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-3 w-full">
        <DropdownMenu>
          <p className="mb-3 px-1">Visibility</p>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full flex justify-between p-6"
            >
              <span className="text-sm font-medium">{capitalize(privacy)}</span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:bg-slate-950 border-0 w-screen px-3">
            <DropdownMenuItem
              className={`flex items-center gap-4 ${
                privacy == "public" && "bg-indigo-800"
              }`}
            >
              <Globe color="white" />
              <div
                className="flex flex-col gap-1 w-full"
                onClick={() => {
                  setPrivacy("public");
                }}
              >
                <span className="text-sm font-medium">Public</span>
                <span className="">Anyone on and off</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`flex items-center gap-4 ${
                privacy == "private" && "bg-indigo-800"
              }`}
            >
              {/* <Moon color="white" /> */}
              <LockKeyhole color="white" />
              <div
                className="flex flex-col gap-1 w-full"
                onClick={() => {
                  console.log("hello");
                  setPrivacy("private");
                }}
              >
                <span className="text-sm font-medium">Private</span>
                <span className="">Only you</span>
              </div>
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              className={`flex items-center gap-4 ${
                privacy == "followers" && "bg-indigo-800"
              }`}
            >
              <LockKeyhole color="white" />
              <div
                className="flex flex-col gap-1"
                onClick={() => {
                  setPrivacy("followers");
                }}
              >
                <span className="text-sm font-medium">Followers</span>
                <span className="">Only your followers</span>
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </DrawerContent>
  );
}
