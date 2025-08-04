"use server";
import {db} from "@/Firebase/admin";
import {generateObject} from "ai";
import {google} from "@ai-sdk/google";
import {feedbackSchema} from "@/constants";


export async function updateUserProfile(params: {
    uid: string
    bio: string
    photoUrl: string
}){
    const { uid, bio, photoUrl } = params
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

    const {interviewId, userId, transcript} = params;

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
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        const feedback = await db.collection('feedback').add({
            interviewId,
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

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {

    const {interviewId, userId} = params;

    const feedback = await db
        .collection('feedback')
        .where('userId', '==', userId)
        .where('interviewId', '==', interviewId)
        .limit(1)
        .get();

    if (feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];

    return {
        id: feedbackDoc.id, ...feedbackDoc.data(),
    } as Feedback;

}
export async function getUsers(){
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