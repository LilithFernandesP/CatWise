import React from 'react'
import {getCurrentUser} from "@/lib/actions/auth.action";
import MyProfileForm from "@/components/MyProfileForm";

const Page = async () => {
    const user = await getCurrentUser();
    if (!user) return <div>Usuário não logado</div>
    return (
        <>
            <MyProfileForm user={user} />
        </>
    )
}
export default Page
