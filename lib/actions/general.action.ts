"use server";
import {db} from "@/Firebase/admin";
import {generateObject} from "ai";
import {google} from "@ai-sdk/google";
import {feedbackSchema} from "@/constants";


export async function updateUserProfile(params: {
    uid: string
    bio: string
    photoUrl: string
}) {
    const {uid, bio, photoUrl} = params
    await db.collection("users").doc(uid).update({
        profilePictureUrl: photoUrl,
        bio
    });
}

export async function GetQuizzesByUserId(userId: string): Promise<Quizz[] | null> {

    const classes = await db
        .collection('classes')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return classes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Quizz[];
}

export async function getLatestQuizzes(params: GetLatestInterviewsParams): Promise<Quizz[] | null> {
    const {userId, limit = 20} = params;

    const classes = await db
        .collection('classes')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .limit(limit)
        .get();

    return classes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Quizz[];

}

export async function getQuizzById(id: string): Promise<Quizz | null> {

    const quizz = await db
        .collection('classes')
        .doc(id)
        .get();

    return quizz.data() as Quizz;
}

export async function createFeedback(params: CreateFeedbackParams) {

    const {quizzId, userId, transcript} = params;

    try {
        const formattedTranscript = transcript.map((sentence: { role: string; content: string; }) => (
            `- ${sentence.role}: ${sentence.content}\n`
        )).join('');

        const {
            object: {
                totalScore,
                categoryScores,
                finalAssessment,
                strengths,
                areasForImprovement
            }
        } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt: `
        You are an AI teacher analyzing a student's performance in a quiz. Your task is to evaluate the student based on structured categories related to learning and comprehension. Be honest and specific in your feedback. Highlight strengths, but also clearly point out mistakes and areas that need improvement to help the student grow academically.

Transcript of student's answers and behavior during the quiz:
${formattedTranscript}

Please score the student from 0 to 100 in the following areas. Do not add categories other than the ones provided:

- **Subject Understanding**: Did the student demonstrate a clear grasp of the main concepts?
- **Accuracy**: Were the answers factually correct and free from major errors?
- **Application & Problem-Solving**: Could the student apply the knowledge to solve problems or explain reasoning?
- **Communication of Reasoning**: Were the explanations clear, logical, and easy to follow?
- **Engagement & Effort**: Did the student show motivation, attention, and willingness to participate?

Give a numerical score (0-100) and a specific comment for each category. At the end, give a **total score** (average of the 5 categories), followed by a short, overall summary of the student's performance.
        `,
            system:
                "You are a professional educator evaluating a student's performance in an academic quiz. Your feedback must be structured, objective, and focused on both strengths and areas to improve. Be supportive, but do not overlook mistakes.",
        });

        const feedback = await db.collection('feedback').add({
            quizzId,
            userId,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            createdAt: new Date().toISOString(),
        })

        return {
            success: true,
            feedbackId: feedback.id
        }
    } catch (e) {
        console.error('error saving feedback', e);
        return {
            success: false
        }
    }
}

export async function getFeedbackByQuizzId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {

    const {quizzId, userId} = params;

    const feedback = await db
        .collection('feedback')
        .where('userId', '==', userId)
        .where('quizzId', '==', quizzId)
        .limit(1)
        .get();

    if (feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];

    return {
        id: feedbackDoc.id, ...feedbackDoc.data(),
    } as Feedback;

}

export async function getUsers() {
    try {
        const snapshot = await db.collection('users').get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as User[];
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return [];
    }
}