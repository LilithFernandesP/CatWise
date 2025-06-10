import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/Firebase/admin";

export async function GET() {
    return Response.json({success:true, data:'Thanks'} , {status:200});
}

export async function POST(request : Request) {
    const { theme, level, amount, userid } = await request.json();

    try {
        const {text : questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt:  `Prepare questions for a class.
        The theme is ${theme}.
        The difficulty is ${level}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
        })
        const classes = {
            theme, level,
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        }
        await db.collection("classes").add(classes);
        return Response.json({success:true} , {status:200});
    }catch(e) {
        console.error(e);
        return Response.json({success:false, e}, {status:500});
    }

}