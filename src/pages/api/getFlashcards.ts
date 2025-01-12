// api/getFlashcards.ts

import { NextApiRequest, NextApiResponse } from 'next';
import {
    createThread,
    addMessageToThread,
    runAssistant,
    waitForRunCompletion,
    retrieveAssistantMessages,
} from '../../utils/openAIHelper';

const parseFlashcards = (content: string) => {
    try {
        // Split the content into individual flashcards
        const flashcards = content.split('\n').map((line) => {
            // Remove any leading/trailing whitespace
            line = line.trim();

            // If the line is empty, skip it
            if (!line) return null;

            // Split the line into "question" and "answer" based on the first colon
            const [question, answer] = line.split(':').map((part) => part.trim());

            // If either the question or answer is missing, skip this line
            if (!question || !answer) return null;

            return {
                question,
                answer,
            };
        });

        // Filter out any null entries (invalid flashcards)
        return flashcards.filter(Boolean);
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
        console.log('Creating new thread for flashcards');
        const thread = await createThread();

        // Add the user message (request for flashcards) to the thread
        const inputMessage = `Generate multiple flashcards for all important concept in vs_TFos1XswweiI4rdUGQ9byQ7R. The flashcard shall be a keyword or important point of the topic to build first knowledge of the topic. It shall be something for students to remember and build a first impression. The response shall be in the format: "keyword:definition" or "question:answer".`;
        console.log('Adding message to thread:', inputMessage);
        await addMessageToThread(thread.id, inputMessage);

        // Run the assistant on the thread
        console.log('Starting assistant run');
        const run = await runAssistant(thread.id);

        // Wait for the run to complete
        await waitForRunCompletion(thread.id, run.id);

        // Retrieve the assistant's messages
        console.log('Retrieving assistant messages for flashcards');
        const assistantMessage = await retrieveAssistantMessages(thread.id);
        console.log('Assistant message:', assistantMessage);

        // Parse the flashcards from the assistant's response
        const flashcards = parseFlashcards(assistantMessage?.content[0].text.value || '');
        console.log('Parsed flashcards:', flashcards);

        return res.status(200).json({ flashcards });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
        return res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
}