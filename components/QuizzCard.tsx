import dayjs from 'dayjs';
import Image from "next/image";
import {getRandomInterviewCover} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import {getFeedbackByInterviewId} from "@/lib/actions/general.action";

const QuizzCard = async ({
                             id,
                             userId,
                             createdAt,
                             theme,
                             area,
                             purpose
                       }: QuizzCardProps) => {

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: userId,
    })
    const normalizedType = /mix/gi.test(theme) ? 'Mixed' : theme;
    const formatedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')

    console.log(feedback)
    return (
        <div className='card-border w-[360px] max-sm:w-full min-h-96'>
            <div className='card-interview'>
                <div>
                    <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg  bg-secondary'>
                        <p className='badge-text'>{normalizedType}</p>
                    </div>
                    <Image src={getRandomInterviewCover()} alt='cover image' width={90} height={90}
                           className='rounded-full object-fit size[90px]'/>

                    <h3 className='mt-5 capitalize'>
                        {area} quiz
                    </h3>

                    <div className='flex flex-row gap-5 mt-3'>
                        <div className='flex flex-row gap-2'>
                            <Image src='/calendar.svg' alt='calendar' width={22} height={22}/>
                            <p>{formatedDate}</p>
                        </div>
                        <div className='flex flex-row gap-2 items-center'>
                            <Image src='/star.svg' alt='star' width={22} height={22}/>
                            <p>{feedback?.totalScore || '---'}/100</p>
                        </div>
                    </div>

                    <p className='line-clamp-2 mt-5'>
                        {feedback?.finalAssessment || "You haven't taken the quiz yet. Take it now to improve your skills"}
                    </p>
                </div>

                <div className='flex flex-row justify-between'>
                    {/*<DisplayTechIcons  techStack={techstack} />*/}
                    <Button className='btn-primary'>
                        <Link href={feedback
                            ? `/interview/${id}/feedback`
                            : `/interview/${id}`
                        }>
                            {feedback ? 'Check Feeback' : "Take the quiz"}
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )

}
export default QuizzCard
