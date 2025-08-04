import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/Firebase/admin";

export async function GET() {
    return Response.json({success: true, data: 'Thanks'}, {status: 200});
}

export async function POST(request: Request) {
    const {theme, level, amount, area, purpose, userid} = await request.json();

    try {
        const {text: questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `As an experienced teacher, create a quiz that feels like an interactive lesson.
The main theme is ${theme}, with a focus on the specific area of interest: ${area}.
The complexity of the questions should be at a ${level} level.
Generate ${amount} questions.
The purpose of the quiz is ${purpose}.

For each question, adopt an explanatory and didactic tone. Imagine you are presenting a concept and then asking a question to check for understanding. Avoid simply listing dry questions.

The questions will be read by a voice assistant, so:
- Do not use special characters like "/", "*", or others that might cause reading issues.
- Ensure each question can be understood independently.

Respond only with a raw JSON array of strings. Do NOT include triple backticks, markdown formatting, or any explanation.
Format example:
["Question 1 with a didactic and contextual touch", "Question 2 that explores an explained concept", "Question 3 that simulates a learning check"]
`,
        })
        const cleaned = questions
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const classes = {
            theme, level, area, purpose,
            questions: JSON.parse(cleaned),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        }
        console.log(questions)
        await db.collection("classes").add(classes);
        return Response.json({success: true}, {status: 200});
    } catch (e) {
        console.error(e);
        return Response.json({success: false, e}, {status: 500});
    }

}