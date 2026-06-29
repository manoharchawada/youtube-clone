import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      const userObj = data.data.user || data.data.loggedInUser || data.data;
      const loggedInUser = userObj.loggedInUser || userObj;
      const accessToken = data.data.accessToken || userObj.accessToken || data.data.user?.accessToken;
      const refreshToken = data.data.refreshToken || userObj.refreshToken || data.data.user?.refreshToken;
      
      setAuth(loggedInUser, accessToken, refreshToken);
      toast.success("Logged in successfully");
      router.push("/");
    },
  });
};
