import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/QuizzCard";
import {getCurrentUser} from '@/lib/actions/auth.action';
import {
    getLatestQuizzes,
    GetQuizzesByUserId
} from "@/lib/actions/general.action";
import {UserCircle} from "lucide-react";
import QuizzCard from "@/components/QuizzCard";

const Page = async () => {
    const user = await getCurrentUser();

    const [userQuizzes, latestQuizzes] = await Promise.all([
        await GetQuizzesByUserId(user?.id!),
        await getLatestQuizzes({userId: user?.id!}),
    ])


    const hasPastQuizzes = userQuizzes?.length > 0;
    const hasUpcomingQuizzes = latestQuizzes?.length > 0;

    return (
        <>


            <section className='card-cta'>
                <div className='flex flex-col gap-6 max-w-lg'>
                    <h2>Get quizzes with AI-Powered Practice & Feedback</h2>
                    <p className='text-lg'>
                        Practice on any theme & get instant feedback
                    </p>
                    <Button asChild className='btn-primary max-sm:w-full'>
                        <Link href='/interview'>Generate a quiz</Link>
                    </Button>
                </div>
                <Image src='/robot.png' alt='robo-dude' width={400} height={400} className='max-sm:hidden'/>
            </section>

            <section className='flex flex-col gap-6 mt-8'>
                <h2>Your quizzes</h2>

                <div className='interviews-section'>
                    {
                        hasPastQuizzes ? (
                            userQuizzes?.map((quizz) => (
                                <QuizzCard {...quizz} userId={user?.id!} key={quizz.id}/>
                            ))) : (
                            <p>You haven&apos;t taken any quiz yet</p>
                        )
                    }


                </div>

            </section>
            <section className='flex flex-col gap-6 mt-8'>
                <h2>Take a quiz</h2>
                <div className='interviews-section'>
                    {
                        hasUpcomingQuizzes ? (
                            latestQuizzes?.map((interview) => (
                                <InterviewCard {...interview} userId={user?.id!} key={interview.id}/>
                            ))) : (
                            <p>There are no quiz available</p>
                        )
                    }
                </div>
            </section>
        </>
    )
}
export default Page
