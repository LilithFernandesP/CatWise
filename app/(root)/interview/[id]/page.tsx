import React from 'react'
import {getQuizzById} from "@/lib/actions/general.action";
import {redirect} from "next/navigation";
import Image from "next/image";
import {getRandomInterviewCover} from "@/lib/utils";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Agent from "@/components/Agent";
import {getCurrentUser} from "@/lib/actions/auth.action";

const Page = async ({params}: RouteParams) => {
    const {id} = await params;
    const user = await getCurrentUser();
    const quizz = await getQuizzById(id);

    if (!quizz) redirect('/')
    return (
        <>
            <div className='flex flex-row gap-4 justify-between'>
                <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
                    <div className='flex flex-row gap-4 items-center'>
                        <Image src={getRandomInterviewCover()} alt='cover-images' width={40} height={40}
                               className='rounded-full object-cover size-[40px]'/>
                        <h3 className='capitalize'>{quizz.theme} quizz</h3>
                    </div>
                    {/*<DisplayTechIcons techStack={quizz.area}/>*/}
                </div>
                <p className='bg-secondary px-4 py-2 rounded-lg h-fit capitalize'>{quizz.level}</p>
            </div>
            <Agent
                userName={user?.name || ''}
                userId={user?.id}
                interviewId={id}
                type="interview"
                questions={quizz.questions}
                area={quizz.area}
                theme={quizz.theme}
                purpose={quizz.purpose}
                userAvatar={user.profilePictureUrl}
            />
        </>
    )
}
export default Page
