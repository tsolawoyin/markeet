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

interface Question {
  id: string;
  question: string;
  vote: number; // for now
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
  createdBy: string; // user_id
  // we will create a different table for those ones
}

export default function Page() {
  const { supabase, user } = useShell();
  const [text, setText] = useState<string>("");
  const [poll, setPoll] = useImmer<Poll | undefined>(undefined); // can be null to start with

  const [post, setPost] = useState<Post>({
    id: v4(),
    content: text,
    poll: poll,
    images: [],
    privacy: "public",
    comments: 0,
    boosts: 0,
    favorites: 0,
    createdBy: !user && user.id
  });

  // we can only have one pool per post...
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

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // cloud will handle this one later...
  const handleImageUpload = async () => {};

  const togglePoll = () => (!poll ? setPoll(templatePool) : setPoll(undefined));

  useEffect(() => {
    console.log(poll);
  }, [poll]);

  return (
    <div className="p-3 grid gap-4">
      <ItemAvatar
        user={{
          fullName: user?.user_metadata.full_name,
          avatarUrl: user?.user_metadata.avatar_url,
          username: user?.user_metadata.username,
        }}
      ></ItemAvatar>
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
        {poll && <Pool poll={poll} setPoll={setPoll} />}
        <InputGroupAddon align="block-end">
          <InputGroupButton
            // variant="outline"
            // className="rounded-full"
            size="icon-xs"
            disabled={!!poll}
          >
            {/* <IconPlus /> */}
            <ImageUp />
          </InputGroupButton>
          <InputGroupButton
            // that's manageable for now. shey you get
            // that's cool. thanks...
            variant={`${poll ? "default" : "outline"}`}
            size={"icon-xs"}
            onClick={togglePoll}
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
            disabled={!text.length}
          >
            <span>Post</span>
            {/* <Loader className="animate-spin" /> */}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function Pool({
  poll,
  setPoll,
}: {
  poll: Poll;
  setPoll: Updater<Poll | undefined>;
}) {
  const [questions, setQuestions] = useImmer<Question[]>(poll.questions);
  // I need to maintain a private state for the questions themselves first
  useEffect(() => {
    // when questions changes, we update it inside pool
    setPoll((draft) => {
      if (draft) {
        draft.questions = questions;
      }
    });
  }, [questions]);
  // I will work on it later. Don't worry. It will be perfect on the long run....
  const handleQuestions = (
    event: ChangeEvent<HTMLInputElement>,
    question: Question,
    posn: number
  ) => {
    let value = event.target.value;
    let MAX_COUNT = 50;

    // nice and easy. makes sense. cool. thank God.
    setQuestions((draft) => {
      // sharp
      const currQuestion = draft.find((q) => q.id == question.id);
      // console.log(currQuestion)
      // console.log(value.length);
      if (currQuestion && value.length <= MAX_COUNT) {
        currQuestion.question = value;
        if (posn > 1 && posn < 4 && draft.length <= posn) {
          draft.push({ id: v4(), question: "", vote: 0 });
        }
      }

      if (currQuestion && value.length == 0) {
        draft.filter((q) => q.id != currQuestion.id);
      }
    });
  };

  return (
    // sharp
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
          {/* <p>{poll.duration}</p>
           */}
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
          {/* <p>{capitalize(poll.style)} choice</p> */}
          <select
            className="appearance-none outline-none text-blue-400"
            onChange={(event) => {
              setPoll((draft) => {
                let value = event.target.value;
                if (value == "single" || value == "multiple") {
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
        {/* <ItemActions>
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-full"
            aria-label="Invite"
          >
            <Plus />
          </Button>
        </ItemActions> */}
      </Item>
    </div>
  );
}
