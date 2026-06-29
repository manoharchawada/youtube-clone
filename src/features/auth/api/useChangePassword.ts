import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { toast } from "sonner";
import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post("/users/change-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
  });
};
