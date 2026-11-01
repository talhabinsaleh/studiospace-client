import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { client } from "./mongodb";
import { passwordProblem } from "./validation";

const db = client.db(process.env.DB_NAME || "studiospace");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      prompt: "select_account",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      // Sign up has no email verification (assignment rule), so Google can open an existing account
      requireLocalEmailVerified: false,
    },
  },
  hooks: {
    // The form checks the password too, but the rule has to hold for direct requests as well
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const problem = passwordProblem(String(ctx.body?.password ?? ""));
      if (problem) throw new APIError("BAD_REQUEST", { message: problem });
    }),
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
