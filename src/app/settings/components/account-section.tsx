"use client";

import { useState } from "react";
import { useApp } from "@/providers/app-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  LogOut,
  Trash2,
  KeyRound,
  Loader,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { deleteAccount } from "../actions";

export function AccountSection() {
  const { user, supabase } = useApp();
  const router = useRouter();

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChangePassword = async () => {
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // router.push("/login"); // we should listen to a signout event instead...
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const result = await deleteAccount(user.id);

      if (result.success) {
        await supabase.auth.signOut();
        router.push("/login");
        toast.success("Account deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete account");
      }
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmText("");
    }
  };

  const inputClassName =
    "py-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-base text-stone-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-900 dark:text-white">
        Account
      </h2>

      <div className="space-y-3">
        {/* Change Password */}
        <div className="bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full flex items-center justify-between p-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <KeyRound className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-stone-900 dark:text-white">
                  Change Password
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Update your account password
                </p>
              </div>
            </div>
            {showPasswordForm ? (
              <ChevronUp className="w-5 h-5 text-stone-400 dark:text-stone-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-stone-400 dark:text-stone-500" />
            )}
          </button>

          {showPasswordForm && (
            <div className="px-4 pb-4 space-y-3 border-t border-stone-200 dark:border-stone-800 pt-4">
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="New password"
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Confirm new password"
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {passwordError && (
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {passwordError}
                </div>
              )}

              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !newPassword || !confirmPassword}
                className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl"
              >
                {isChangingPassword ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-300 dark:hover:border-red-800 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <LogOut className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              Sign Out
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-500">
              Log out of your account
            </p>
          </div>
        </button>

        {/* Delete Account */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-300 dark:hover:border-red-800 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <Trash2 className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              Delete Account
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-500">
              Permanently delete your account and all data
            </p>
          </div>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent className="dark:bg-stone-900 dark:border-stone-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 dark:text-red-400">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-stone-400">
              This action is permanent and cannot be undone. All your listings,
              orders, wallet balance, and personal data will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-2">
            <p className="text-sm text-stone-700 dark:text-stone-300 mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to
              confirm:
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="bg-white dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete My Account"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
