"use client";

import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Check } from "lucide-react";

import { getTimeRemaining } from "@/lib/get-time-remaining";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

import Link from "next/link";

interface Question {
  id: string;
  question: string;
  vote: number;
}

export interface Poll {
  id: string;
  questions: Question[];
  duration: string;
  style: "single" | "multiple";
  expiresAt: string; // ISO timestamp
}

interface PollComponentProps {
  poll: Poll;
  onVote?: (questionIds: string[]) => void;
}

export default function PollComponent({ poll, onVote }: PollComponentProps) {
  // exactly
  // this is sharp thinking
  const [selectedOptions, setSelectedOptions] = useImmer<string[]>([]);
  // Yes I'm currently dealing with the user hasn't voted state
  const hasUserVoted = false; // TODO: Add Supabase lookup to check if user has voted

  // Calculate total votes
  const totalVotes = poll.questions.reduce((sum, q) => sum + q.vote, 0);

  // Check if poll is expired
  const isExpired = poll.expiresAt
    ? new Date(poll.expiresAt) < new Date()
    : false;

  const canVote = !hasUserVoted && !isExpired;

  // Handle vote submission
  const handleVote = () => {
    if (selectedOptions.length === 0 || !canVote) return;
    onVote?.(selectedOptions);
  };

  // Calculate percentage for a question
  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  // This is one state
  if (canVote) {
    return (
      <div className="">
        {poll.style == "single" ? (
          // this one for single choices
          <RadioGroup
            className="pt-4 grid gap-5"
            onValueChange={(value) => {
              // console.log(value);
              // there can't be a combination of values here
              if (!selectedOptions.includes(value)) {
                setSelectedOptions(() => {
                  return [value]; // that's all
                });
              }
            }}
          >
            {poll.questions.map((question, index) => {
              return (
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={question.id} id={question.id} />
                  <Label htmlFor={question.id}>{question.question}</Label>
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="grid gap-5 pt-5">
            {poll.questions.map((question) => {
              return (
                <div className="flex items-center gap-3">
                  {/* This enables us to have multiple answers */}
                  <Checkbox
                    id={question.id}
                    onCheckedChange={(checked) => {
                      // console.log(checked)
                      if (checked) {
                        setSelectedOptions((draft) => {
                          draft.push(question.id); // we pass in the id for now sha
                        });
                      } else {
                        setSelectedOptions((draft) => {
                          let newFilterList = draft.filter(
                            (id) => id != question.id
                          );
                          return newFilterList; // sharp
                        });
                      }
                    }}
                  />
                  <Label htmlFor={question.id} className="font-medium">
                    {question.question}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
        {/* I'll try to make it local here sha */}
        <footer className="flex items-center mt-7 gap-3">
          <Button variant={"outline"}>Vote</Button>
          <p className="text-sm text-muted-foreground underline">
            <Link href="#">See results</Link>
          </p>
          <p className="text-sm text-muted-foreground">1 person</p>
          <p className="text-sm text-muted-foreground ">
            <PollTimer expiresAt={poll.expiresAt} />
          </p>
        </footer>
      </div>
    );
  } else {
    // user will just see only result here. that's all
    // and the results have only one state.
  }
}

function PollTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(expiresAt));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span>{timeLeft}</span>;
}
