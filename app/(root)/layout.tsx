import React, {Children, ReactNode} from 'react'
import Link from "next/link";
import Image from "next/image";
import {getCurrentUser, isAuthenticated} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";
import {UserCircle} from "lucide-react";

const RootLayout = async ({children} : {children : ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();
    const user = await getCurrentUser();
    if(!isUserAuthenticated) redirect('/sign-in');

    return (
        <div className='root-layout'>
            <nav className='flex justify-between'>
                <Link href='/' className='flex items-center gap-2'>
                    <Image src='/CatWise.png' alt='Logo' width={38} height={32}/>
                    <h2 className='text-textColor'>Catwise</h2>
                </Link>
                {user?.profilePictureUrl ? (
                    <Link href={`/users/myProfile`}><img
                        src={user.profilePictureUrl}
                        alt="Foto de perfil"
                        className="rounded-4xl w-[40px] h-[40px] self-end mx-2 object-cover"
                    /></Link>
                ) : (
                    <UserCircle className="w-[40px] h-[40px] text-gray-400 self-end mx-2" />
                )}
            </nav>

            {children}
        </div>
    )
}
export default RootLayout
