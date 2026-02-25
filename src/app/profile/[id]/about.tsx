"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { ParamValue } from "next/dist/server/request/params";

export async function fetchAbout(
  userId: string | ParamValue,
): Promise<any | null> {
  if (!userId) return null;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("about")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Error fetching about:", error);
    throw error;
  }

  return data;
}

export default function About() {
  const params = useParams();
  const { user } = useApp();
  const isOwner = params.id === "me" || params.id == user?.id;

  const [about, setAbout] = useState<{
    headline?: string;
    bio?: string;
    skills?: string[];
  }>({
    headline: "",
    bio: "",
    skills: [],
  });

  useEffect(() => {
    if (isOwner) {
      if (user && user.about) {
        setAbout({
          headline: user.about.headline,
          bio: user.about.bio,
          skills: user.about.skills,
        });
      }
    } else {
      fetchAbout(params.id).then((data) => {
        if (data) {
          setAbout({
            headline: data?.headline,
            bio: data?.bio,
            skills: data?.skills,
          });
        }
      });
    }
  }, []);

  return (
    <div className="px-5 lg:px-12 py-6 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-white">
          About
        </h2>
      </div>

      <div className="mb-4">
        {about.headline ? (
          <div className="text-base font-semibold text-stone-800 dark:text-stone-200 mb-2">
            {about.headline}
          </div>
        ) : (
          isOwner && (
            <div className="text-base text-stone-400 dark:text-stone-500 italic mb-2">
              Add a headline to describe what you do
            </div>
          )
        )}
        {about.bio ? (
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-wrap">
            {about.bio}
          </p>
        ) : (
          isOwner && (
            <p className="text-sm text-stone-400 dark:text-stone-500 italic">
              Write a bio to tell people about yourself
            </p>
          )
        )}
      </div>

      <div>
        <div className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">
          Skills & Services
        </div>
        <div className="flex flex-wrap gap-2">
          {about.skills?.length ? (
            about.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full border border-orange-200 dark:border-orange-800/40"
              >
                #{skill}
              </span>
            ))
          ) : (
            isOwner && (
              <span className="text-sm text-stone-400 dark:text-stone-500 italic">
                Add up to 10 skills
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
