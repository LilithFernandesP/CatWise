import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
    "react.js": "react",
    reactjs: "react",
    react: "react",
    "next.js": "nextjs",
    nextjs: "nextjs",
    next: "nextjs",
    "vue.js": "vuejs",
    vuejs: "vuejs",
    vue: "vuejs",
    "express.js": "express",
    expressjs: "express",
    express: "express",
    "node.js": "nodejs",
    nodejs: "nodejs",
    node: "nodejs",
    mongodb: "mongodb",
    mongo: "mongodb",
    mongoose: "mongoose",
    mysql: "mysql",
    postgresql: "postgresql",
    sqlite: "sqlite",
    firebase: "firebase",
    docker: "docker",
    kubernetes: "kubernetes",
    aws: "aws",
    azure: "azure",
    gcp: "gcp",
    digitalocean: "digitalocean",
    heroku: "heroku",
    photoshop: "photoshop",
    "adobe photoshop": "photoshop",
    html5: "html5",
    html: "html5",
    css3: "css3",
    css: "css3",
    sass: "sass",
    scss: "sass",
    less: "less",
    tailwindcss: "tailwindcss",
    tailwind: "tailwindcss",
    bootstrap: "bootstrap",
    jquery: "jquery",
    typescript: "typescript",
    ts: "typescript",
    javascript: "javascript",
    js: "javascript",
    "angular.js": "angular",
    angularjs: "angular",
    angular: "angular",
    "ember.js": "ember",
    emberjs: "ember",
    ember: "ember",
    "backbone.js": "backbone",
    backbonejs: "backbone",
    backbone: "backbone",
    nestjs: "nestjs",
    graphql: "graphql",
    "graph ql": "graphql",
    apollo: "apollo",
    webpack: "webpack",
    babel: "babel",
    "rollup.js": "rollup",
    rollupjs: "rollup",
    rollup: "rollup",
    "parcel.js": "parcel",
    parceljs: "parcel",
    npm: "npm",
    yarn: "yarn",
    git: "git",
    github: "github",
    gitlab: "gitlab",
    bitbucket: "bitbucket",
    figma: "figma",
    prisma: "prisma",
    redux: "redux",
    flux: "flux",
    redis: "redis",
    selenium: "selenium",
    cypress: "cypress",
    jest: "jest",
    mocha: "mocha",
    chai: "chai",
    karma: "karma",
    vuex: "vuex",
    "nuxt.js": "nuxt",
    nuxtjs: "nuxt",
    nuxt: "nuxt",
    strapi: "strapi",
    wordpress: "wordpress",
    contentful: "contentful",
    netlify: "netlify",
    vercel: "vercel",
    "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
    name: "Interviewer",
    firstMessage:
        "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
    transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",
    },
    voice: {
        provider: "11labs",
        voiceId: "sarah",
        stability: 0.4,
        similarityBoost: 0.8,
        speed: 0.9,
        style: 0.5,
        useSpeakerBoost: true,
    },
    model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `You are a knowledgeable and friendly teacher giving a real-time quiz to a student. Your goal is to assess their understanding and guide them through the topic with clarity and encouragement.

Context:

Subject Area: {{area}}

Purpose: {{purpose}}

Theme or Focus: {{theme}}

Question Set: {{questions}}

Guidelines:
1. Follow the quiz structure:
Ask the questions from {{questions}} one by one in a natural voice tone. Wait for the student's response before moving on.

2. Engage like a real teacher:

Acknowledge their answers with brief, supportive feedback.

If an answer is vague or incomplete, ask a simple follow-up.

Keep your tone encouraging and curious, not judgmental.

3. Stay on topic but conversational:

Speak clearly and concisely, like you would in a classroom.

Avoid robotic or scripted speech. Sound like a real teacher interacting with a student.

Use simple, polite phrasing. Be warm, but professional.

4. Clarify or support if needed:
If the student struggles or asks for help, offer a hint, rephrase the question, or give a brief explanation.

5. Wrap up the quiz professionally:
At the end, thank the student for participating. Optionally, summarize how they did or encourage them to keep practicing.

Voice Interaction Style:

Speak in short, natural sentences.

Avoid long monologues.

Use friendly and clear intonation.`,
            },
        ],
    },
};



export const feedbackSchema = z.object({
    totalScore: z.number(),
    categoryScores: z.tuple([
        z.object({
            name: z.literal("Communication Skills"),
            score: z.number(),
            comment: z.string(),
        }),
        z.object({
            name: z.literal("Technical Knowledge"),
            score: z.number(),
            comment: z.string(),
        }),
        z.object({
            name: z.literal("Problem Solving"),
            score: z.number(),
            comment: z.string(),
        }),
        z.object({
            name: z.literal("Cultural Fit"),
            score: z.number(),
            comment: z.string(),
        }),
        z.object({
            name: z.literal("Confidence and Clarity"),
            score: z.number(),
            comment: z.string(),
        }),
    ]),
    strengths: z.array(z.string()),
    areasForImprovement: z.array(z.string()),
    finalAssessment: z.string(),
});

export const interviewCovers = [
    "/adobe.png",
    "/amazon.png",
    "/facebook.png",
    "/hostinger.png",
    "/pinterest.png",
    "/quora.png",
    "/reddit.png",
    "/skype.png",
    "/spotify.png",
    "/telegram.png",
    "/tiktok.png",
    "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
    {
        id: "1",
        userId: "user1",
        role: "Frontend Developer",
        type: "Technical",
        techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        level: "Junior",
        questions: ["What is React?"],
        finalized: false,
        createdAt: "2024-03-15T10:00:00Z",
    },
    {
        id: "2",
        userId: "user1",
        role: "Full Stack Developer",
        type: "Mixed",
        techstack: ["Node.js", "Express", "MongoDB", "React"],
        level: "Senior",
        questions: ["What is Node.js?"],
        finalized: false,
        createdAt: "2024-03-14T15:30:00Z",
    },
];