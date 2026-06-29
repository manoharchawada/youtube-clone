import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Assuming you might need to upload avatar and cover later, but basic register might just take json
      // If it requires multipart form data, we'll convert it. Here we assume json for now.
      const response = await api.post("/users/register", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Registered successfully. Please log in.");
      router.push("/login");
    },
  });
};
