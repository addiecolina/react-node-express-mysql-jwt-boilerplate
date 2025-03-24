import { z } from "zod";

export const userSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least three characters long"),
    password: z
      .string()
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      )
      .regex(
        /^[a-zA-Z0-9 !#()_-]+$/,
        "Password can only contain alphanumeric characters and special characters !#()_-."
      )
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.username !== data.password, {
    message: "Username and password should not be equal",
    path: ["password"],
  });
