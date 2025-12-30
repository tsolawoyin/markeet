"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Updater, useImmer } from "use-immer"; // another lesson learned here. sharp thing. thank you. eseun gan ni...
import { Check } from "lucide-react";

import { getTimeRemaining } from "@/lib/get-time-remaining";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

import { Loader } from "lucide-react";

import Link from "next/link";
import { Progress } from "../ui/progress";

import { useShell } from "@/shell/shell";

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
  hasVoted: boolean;
}

interface PollComponentProps {
  poll: Poll;
  onVote?: (questionIds: string[]) => void;
}

// sharp...
// the only thing remaining is the live update.
export default function PollComponent({ poll, onVote }: PollComponentProps) {
  // exactly
  // this is sharp thinking
  const { supabase, user } = useShell(); // sharp
  const [selectedOptions, setSelectedOptions] = useImmer<string[]>([]);
  const [previousSelection, setPreviousSelection] = useState<string | null>(
    null
  );
  const [questions, setQuestions] = useImmer<Question[]>(poll.questions); // this one needs update
  const [seeResult, setSeeResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Yes I'm currently dealing with the user hasn't voted state
  // actually, we should implement it sharp
  // We always assume that user has voted. makes sense
  const hasUserVoted = poll.hasVoted;
  //   const [hasUserVoted, setHasUserVoted] = useState(false); // TODO: Add Supabase lookup to check if user has voted

  // Calculate total votes
  const totalVotes = poll.questions.reduce((sum, q) => sum + q.vote, 0);

  // Check if poll is expired
  const isExpired = poll.expiresAt
    ? new Date(poll.expiresAt) < new Date()
    : false;

  const canVote = !hasUserVoted && !isExpired;
  const showResult = hasUserVoted || isExpired || seeResult;

  // Handle vote submission
  const handleVote = async () => {
    const userHasVoted = async (pollId: string, userId: string | undefined) => {
      const { data, error } = await supabase
        .from("poll_votes")
        // , { count: "exact", head: true }
        .select("*") // Just count, don't fetch data
        .eq("user_id", userId)
        .eq("poll_id", pollId);

      if (error) {
        console.error("Error checking vote:", error);
        return false;
      }

      return data.length > 0;
    };

    if (selectedOptions.length === 0 || !canVote) return;
    // onVote?.(selectedOptions);
    setSubmitting(true);

    const poll_votes = selectedOptions.map((option) => {
      return {
        poll_id: poll.id,
        question_id: option,
        user_id: user?.id,
      };
    });

    try {
      // just double-checking to ensure no double voting anywhere
      let voted = await userHasVoted(poll.id, user?.id);
      if (!voted) {
        let { error } = await supabase.from("poll_votes").insert(poll_votes); // imagine

        if (error) throw error;

        // sharp... nice and easy my nigor
        setSeeResult(true);
      } else {
        // user wants to revote which is unfortunately not possible. Sorry o.
        // Ole thief
        setSubmitting(false);
      }
    } catch (error) {
      // setSeeResult(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(questions);
  }, [questions]);
  // Hello world...
  // God help us...
  return (
    <div>
      {canVote && !showResult ? (
        <PollVote
          // sharp
          style={poll.style}
          questions={questions}
          setSelectedOptions={setSelectedOptions}
          setQuestions={setQuestions}
          previousSelection={previousSelection}
          setPreviousSelection={setPreviousSelection}
        />
      ) : (
        <PollResult questions={questions} />
      )}

      <footer className="flex items-center mt-7 gap-3">
        {canVote && !showResult && (
          <Button variant={"outline"} onClick={handleVote}>
            {submitting ? <Loader className="animate-spin" /> : "Vote"}
          </Button>
        )}
        {canVote && !showResult && (
          <p
            className="text-sm text-muted-foreground underline"
            onClick={() => setSeeResult(true)}
          >
            See results
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {canVote && !seeResult ? "1 person" : `${totalVotes} votes`}
        </p>
        <p className="text-sm text-muted-foreground ">
          <PollTimer expiresAt={poll.expiresAt} />
        </p>
      </footer>
    </div>
  );
}

// Sharp. Makes sense now

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

function PollResult({ questions }: { questions: Question[] }) {
  // Calculate total votes
  const totalVotes = questions.reduce((sum, q) => sum + q.vote, 0);

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="grid gap-5 pt-5">
      {questions.map((question) => {
        let percent = getPercentage(question.vote);

        // Find max vote count for relative color intensity
        const maxVote = Math.max(...questions.map((q) => q.vote), 1);
        const minVote = Math.min(...questions.map((q) => q.vote));

        // Calculate relative intensity (0 to 1)
        const voteRange = maxVote - minVote || 1;
        const relativeIntensity =
          maxVote === 0 ? 0.5 : (question.vote - minVote) / voteRange;

        // Map intensity to lightness range (50% to 75%)
        // Higher votes = brighter (higher lightness)
        // Lower votes = darker (lower lightness)
        const lightness = 50 + relativeIntensity * 25; // 50% to 75%

        // Keep chroma higher for more vibrant colors
        const chroma = 0.18;

        return (
          <div className="grid gap-2" key={question.id}>
            <div className="flex gap-5">
              <span className="font-medium">{percent}%</span>
              <span>{question.question}</span>
            </div>
            <div
              style={{
                background: `oklch(${lightness}% ${chroma} 277)`,
                width: `${Math.max(percent, 2)}%`,
              }}
              className="h-1 rounded-sm"
            />
          </div>
        );
      })}
    </div>
  );
}

function PollVote({
  style,
  questions,
  setSelectedOptions,
  setQuestions,
  previousSelection,
  setPreviousSelection,
}: {
  style: string;
  questions: Question[];
  setSelectedOptions: Updater<string[]>;
  previousSelection: string | null;
  setQuestions: Updater<Question[]>;
  setPreviousSelection: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <div className="">
      {style == "single" ? (
        // this one for single choices
        <RadioGroup
          className="pt-4 grid gap-5"
          onValueChange={(value) => {
            setSelectedOptions(() => {
              return [value];
            });

            setQuestions((draft) => {
              // Decrement the previous selection
              if (previousSelection) {
                let prev = draft.find((q) => q.id === previousSelection);
                if (prev && prev.vote > 0) {
                  prev.vote -= 1;
                }
              }

              // Increment the new selection
              let curr = draft.find((q) => q.id === value);
              if (curr) {
                curr.vote += 1;
              }
            });

            // Update previous selection
            setPreviousSelection(value);
          }}
        >
          {questions.map((question, index) => {
            return (
              <div className="flex items-center gap-3" key={question.id}>
                <RadioGroupItem value={question.id} id={question.id} />
                <Label htmlFor={question.id}>{question.question}</Label>
              </div>
            );
          })}
        </RadioGroup>
      ) : (
        <div className="grid gap-5 pt-5">
          {questions.map((question) => {
            return (
              <div className="flex items-center gap-3">
                {/* This enables us to have multiple answers */}
                <Checkbox
                  id={question.id}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOptions((draft) => {
                        draft.push(question.id);
                      });

                      setQuestions((draft) => {
                        let curr = draft.find((q) => q.id === question.id);
                        if (curr) {
                          curr.vote += 1;
                        }
                      });
                    } else {
                      setSelectedOptions((draft) => {
                        // Find and remove the item - Immer style
                        const index = draft.findIndex(
                          (id: string) => id === question.id
                        );
                        if (index !== -1) {
                          draft.splice(index, 1);
                        }
                      });

                      setQuestions((draft) => {
                        let curr = draft.find((q) => q.id === question.id);
                        if (curr && curr.vote > 0) {
                          // ← Safety check to prevent negative votes
                          curr.vote -= 1;
                        }
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
    </div>
  );
}
