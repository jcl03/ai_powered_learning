// api/getExample.ts

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
}

if (!process.env.ASSISTANT_ID_2) { // Assuming a different assistant for examples
    console.error('ASSISTANT_ID_2 is not set');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Load assistant
const assistantId = process.env.ASSISTANT_ID_1 || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        // Create a new thread
        console.log('Creating new thread for example');
        const thread = await openai.beta.threads.create();

        // Add the user message (request for example) to the thread
        const inputMessage = `Please provide a step-by-step example for the topic: "${topic}". The example should be clear and easy to follow. The example shall be step by step. use file search, vector id: vs_TFos1XswweiI4rdUGQ9byQ7R. generate new and different example on every run`;
        console.log('Adding message to thread:', inputMessage);
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: inputMessage,
        });

        // Run the assistant on the thread
        console.log('Starting assistant run with ID:', assistantId);
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });

        // Wait for the run to complete
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        while (runStatus.status !== 'completed') {
            console.log('Run status:', runStatus.status);
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        // Retrieve the assistant's messages
        console.log('Retrieving assistant messages for example');
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        console.log('Assistant message:', assistantMessage);

        const example = assistantMessage?.content[0].text.value || '';
        console.log('Generated example:', example);

        return res.status(200).json({ example });
    } catch (error) {
        console.error('Error generating example:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
        return res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
}