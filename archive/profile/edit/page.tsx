"use client";

import { useState, useContext, useEffect } from "react";
import { ShellContext } from "@/shell/shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfilePage() {
    const { supabase, user } = useContext(ShellContext);
    const [profile, setProfile] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
        setProfile(data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: profile.full_name,
                bio: profile.bio,
                phone: profile.phone,
            })
            .eq("id", user.id);

        if (!error) {
            alert("Profile updated!");
        }
        setSaving(false);
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSave} className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            <div className="space-y-4">
                <div>
                    <label>Full Name</label>
                    <Input
                        value={profile.full_name}
                        onChange={(e) =>
                            setProfile({ ...profile, full_name: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label>Bio</label>
                    <textarea
                        value={profile.bio || ""}
                        onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                        }
                        className="w-full p-3 border rounded"
                        rows={4}
                    />
                </div>

                <div>
                    <label>Phone</label>
                    <Input
                        value={profile.phone}
                        onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                        }
                    />
                </div>

                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}