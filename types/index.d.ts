interface Feedback {
    id: string;
    interviewId: string;
    totalScore: number;
    categoryScores: Array<{
        name: string;
        score: number;
        comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
}
interface Quizz{
    id: string;
    level: string;
    theme: string;
    amount: number;
    userId: string;
    area: string;
    purpose: string;
    finalized: boolean;
    questions: string[];
}
interface Interview {
    id: string;
    role: string;
    level: string;
    questions: string[];
    techstack: string[];
    createdAt: string;
    userId: string;
    type: string;
    finalized: boolean;
}

interface CreateFeedbackParams {
    quizzId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
}

interface User {
    bio: string;
    username: string;
    name: string;
    email: string;
    id: string;
    profilePictureUrl: string;
}

interface QuizzCardProps {
    id?: string;
    userId?: string;
    theme?: string;
    area?: string;
    purpose?: string;
    createdAt?: string;
}

interface AgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
    userAvatar : string;
    theme?: string;
    area?: string;
    purpose?: string;
}

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
    quizzId: string;
    userId: string;
}

interface GetLatestInterviewsParams {
    userId: string;
    limit?: number;
}

interface SignInParams {
    email: string;
    idToken: string;
}

interface SignUpParams {
    uid: string;
    name: string;
    email: string;
    password: string;
    profilePicture: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
    interviewId: string;
    role: string;
    level: string;
    type: string;
    techstack: string[];
    amount: number;
}

interface TechIconProps {
    techStack: string[];
}
