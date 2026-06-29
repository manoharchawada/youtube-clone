import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post("/users/logout");
    },
    onSuccess: () => {
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      logout(); // clear state anyway
      router.push("/login");
    }
  });
};
