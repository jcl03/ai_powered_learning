import { NextApiRequest, NextApiResponse } from 'next';
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

// Load assistant
const assistantId = process.env.ASSISTANT_ID_1 || '';

const parseFlashcards = (content: string) => {
    try {
        const flashcards = content.split('\n').map((line) => {
            const [question, answer] = line.split(':');
            if (question && answer) {
                return {
                    question: question.trim(),
                    answer: answer.trim(),
                };
            }
            return null;
        });
        return flashcards.filter(Boolean); // Remove null entries
    } catch (error) {
        console.log('Error parsing flashcards:', error);
        return [];
    }
};

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
        console.log('Creating new thread');
        const thread = await openai.beta.threads.create();

        // Add the user message (request for flashcards) to the thread
        const inputMessage = `Generate multiple flashcards for vs_TFos1XswweiI4rdUGQ9byQ7R  the flashcard shall be a keyword or important point of the topic to build first knowledge of the topic. It shall be something for student to rember and build first impression`;
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
        console.log('Retrieving assistant messages');
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        console.log('Assistant message:', assistantMessage);

        const flashcards = parseFlashcards(assistantMessage?.content[0].text.value || '');
        console.log('Parsed flashcards:', flashcards);

        return res.status(200).json({ flashcards });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
        return res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
}
