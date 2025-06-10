"use server";
import {auth, db} from "@/Firebase/admin";
import {cookies} from "next/headers";


const ONE_WEEK = 60 * 60 * 24 * 7;

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function isUsernameTaken(Params: { username: string }) {
    const Snapshot = await db.collection('users').where("username", "==", Params.username).get();
    return !Snapshot.empty;

}

export async function signUp(Params: {
    uid: string;
    name: string;
    email: string;
    username: string;
    password: string;
    profilePictureUrl?: string | ""
}) {
    const {uid, name, email, profilePictureUrl, username} = Params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                msg: 'User already exists!'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            username,
            email,
            profilePictureUrl: profilePictureUrl || "",
        })

        return {
            success: true,
            msg: 'Account created successfully'
        }

    } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                msg: 'Email already exists',
            }
        }
        return {
            success: false,
            msg: 'Failed to create and account',
        }
    }

}

export async function signIn(Params: SignInParams) {
    const {email, idToken} = Params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                msg: 'User does not exists!'
            }
        }
        await setSessionCookie(idToken)

    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: 'failed to login',
        }
    }

}

export async function getCurrentUser(): Promise<User | null> {

    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User

    } catch (error) {
        console.log(error);
        return null;
    }

}

export async function GetUserByUsername({username}: {username: string}) {
    const snapshot  = await db.collection('users').where("username", "==", username).get();
    if (snapshot.empty) return null;

    return snapshot.docs[0].data();
}

export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();

    return !!user;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
        maxAge: 0,
        path: "/",
    });
}