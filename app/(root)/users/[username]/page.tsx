import React from 'react'
import {GetUserByUsername} from "@/lib/actions/auth.action";

const Page = async ({params}: RouteParams) => {
    const {username} = await params;
    const user = await GetUserByUsername({username});
    return (
        <>
            {user ? (
                    <div>
                        <div className=''>
                            {user.name}
                        </div>
                    </div>
                ) :
                <div className='flex justify-center text-3xl text-red-900 '>
                    Nenhum usuário encontrado {username}
                </div>
            }
        </>
    )
}
export default Page
