"use client"
import {Button} from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth, storage} from "@/Firebase/client";

import {isUsernameTaken, signIn, signUp} from "@/lib/actions/auth.action";

import {useState} from "react";
import {uploadProfilePicture} from "@/lib/client/uploadProfilePicture";


const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(6) : z.string().optional(),
        username: type === 'sign-up' ? z.string().min(6) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
        profilePicture: type === 'sign-up'
            ? z
                .union([
                    z
                        .instanceof(File)
                        .refine((file) => file.type.startsWith('image/'), {
                            message: 'Apenas arquivos de imagem são permitidos',
                        }),
                    z.undefined(),
                ])
            : z.any().optional(),
    })
}

const AuthForm = ({type}: { type: FormType }) => {

    const formSchema = authFormSchema(type)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            profilePicture: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-up") {
                const {name, username, email, password, profilePicture} = values;

                if (!email || !password) {
                    toast.error("Email and password are required");
                    return;
                }
                if(await isUsernameTaken({username})){
                    toast.error("Username already taken")
                    return;
                }
                setIsLoading(true)
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                let profilePictureUrl = "";
                if (profilePicture) {
                    try {
                        profilePictureUrl = await uploadProfilePicture(profilePicture, userCredentials.user.uid);
                    } catch (uploadError: any) {
                        toast.error("Upload failed:", uploadError);
                        profilePictureUrl = "";
                        setIsLoading(false)
                    }
                }


                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    username,
                    email,
                    password,
                    profilePictureUrl,
                })
                setIsLoading(false)
                if (!result.success) {
                    toast.error(result.msg);
                    return;
                }


                toast.success("Account created successfully. Please sign in")
                router.push("/sign-in")
            } else {
                const {email, password} = values;
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    return {
                        success: false,
                        msg: "User not found",
                    }
                }

                setIsLoading(true)
                await signIn({email, idToken})

                setIsLoading(false)
                toast.success("Sign in successfully.")
                router.push("/")

            }
        } catch (error) {
            console.log(error)
            toast.error(`There was an error: ${error}`)
        }
    }

    const isSignIn = type === "sign-in";


    return (
        <div className="bg-gradient-to-b from-[#C55EF4] to-background rounded-xl lg:min-w-[566px]">
            <div className='flex flex-col gap-6 py-14 px-10'>
                <div className='flex flex-row gap-2 justify-center'>
                    <Image src="/CatWise.png" alt="logo" height={32} width={38}/>
                    <h2 className='text-textColor'>CatWise</h2>
                </div>
                <h3 className='text-primary-200 self-center'>Take AI quizzes made just for you</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="    space-y-6 mt-4 form">
                        {!isSignIn ? (
                            <>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    label="Name"
                                    placeholder="Your Name"
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    label="Username"
                                    placeholder="How others will see you"
                                />
                            </>
                        ) : null}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your Email"
                            type="email"
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />
                        {!isSignIn && (<FormField
                            control={form.control}
                            name="profilePicture"
                            label="Profile Picture"
                            placeholder=""
                            type="file"
                        />)}
                        {isLoading &&
                            (  <div className='flex items-center justify-center'>
                                <svg aria-hidden="true"
                                     className="w-8 h-8 text-gray-200 animate-spin dark:background fill-primary"
                                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"/>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"/>
                                </svg>
                            </div>)
                        }
                        <Button className='btn' type="submit">{isSignIn ? 'Sign In' : 'Create an Account'}</Button>
                    </form>
                </Form>
                <p className='text-center'>
                    {isSignIn ? 'No account yet?' : 'Have an account already?'}
                    <Link className='font-bold text-user-primary ml-1' href={!isSignIn ? '/sign-in' : '/sign-up'}>
                        {!isSignIn ? 'Sign In' : 'Sign Up'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default AuthForm
