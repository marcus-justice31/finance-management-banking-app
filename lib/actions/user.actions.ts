"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { parse } from "path";

export const signIn = async ({ email, password }: signInProps) => {
    try {
        // mutation / database / make fetch
        const { account } = await createAdminClient();

        const response = await account.createEmailPasswordSession({
            email, 
            password
        });

        (await cookies()).set("appwrite-session", response.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(response);

    } catch (error) {
            console.log("Error",error);
    }
}

export const signUp = async (userData: SignUpParams) => {
    const { email, password, firstName, lastName } = userData;

    try {
        // Create a user account with Appwrite
        const { account } = await createAdminClient();

        const newUserAccount = await account.create({
            userId: ID.unique(),
            email,
            password,
            name: `${firstName} ${lastName}`
        });
        const session = await account.createEmailPasswordSession({
            email,
            password
        });

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount);
    } catch (error: any) {
        if (error.code === 409) {
            return {
            success: false,
            message: "User already exists. Please sign in instead.",
            };
        }

        return {
            success: false,
            message: "Something went wrong.",
        };
    }
}

// Apprite get logged in user function
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    console.log("Error fetching logged in user:", error);
    return null;
  }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();

        (await cookies()).delete("appwrite-session");

        await account.deleteSession("current");
    } catch (error) {
        return null;
    }
}