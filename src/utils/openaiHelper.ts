// utils/openAIHelper.ts

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
}

if (!process.env.ASSISTANT_ID_1) {
    console.error('ASSISTANT_ID_1 is not set');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

const assistantId = process.env.ASSISTANT_ID_1 || '';

export async function createThread() {
    return await openai.beta.threads.create();
}

export async function addMessageToThread(threadId: string, content: string) {
    return await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content,
    });
}

export async function runAssistant(threadId: string) {
    return await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
    });
}

export async function waitForRunCompletion(threadId: string, runId: string) {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    while (runStatus.status !== 'completed') {
        console.log('Run status:', runStatus.status);
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    }
    return runStatus;
}

export async function retrieveAssistantMessages(threadId: string) {
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data.find(msg => msg.role === 'assistant');
}