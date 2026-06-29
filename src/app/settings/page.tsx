"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useChangePassword, changePasswordSchema, ChangePasswordData } from "@/features/auth/api/useChangePassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  if (!user) {
    return <div className="text-center py-10">Please log in to view settings.</div>;
  }

  const onSubmit = (data: ChangePasswordData) => {
    changePassword(data, {
      onSuccess: () => reset(),
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        Settings
      </h1>

      <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold">Change Password</h2>
          <p className="text-sm text-muted-foreground mt-1">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input id="oldPassword" type="password" {...register("oldPassword")} />
            {errors.oldPassword && <p className="text-xs text-destructive">{errors.oldPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} />
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>

      <div className="bg-destructive/10 p-6 rounded-2xl border border-destructive/20 flex flex-col gap-4 items-start">
        <div>
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mt-1">Log out of your account on this device.</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
}
