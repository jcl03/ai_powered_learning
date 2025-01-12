// api/getExample.ts

import { NextApiRequest, NextApiResponse } from 'next';
import {
    createThread,
    addMessageToThread,
    runAssistant,
    waitForRunCompletion,
    retrieveAssistantMessages,
} from '../../utils/openAIHelper';

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
        const thread = await createThread();

        // Add the user message (request for example) to the thread
        const inputMessage = `Please provide a step-by-step example for the topic: "${topic}". The example should be clear and easy to follow. The example shall be step by step. use file search, vector id: vs_TFos1XswweiI4rdUGQ9byQ7R. generate new and different example on every run`;
        console.log('Adding message to thread:', inputMessage);
        await addMessageToThread(thread.id, inputMessage);

        // Run the assistant on the thread
        console.log('Starting assistant run');
        const run = await runAssistant(thread.id);

        // Wait for the run to complete
        await waitForRunCompletion(thread.id, run.id);

        // Retrieve the assistant's messages
        console.log('Retrieving assistant messages for example');
        const assistantMessage = await retrieveAssistantMessages(thread.id);
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