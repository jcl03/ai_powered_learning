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

    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    try {
        // Create a new thread
        console.log('Creating new thread for chat');
        const thread = await createThread();

        // Add the user message (question) to the thread
        const inputMessage = `Search the file (vector id: vs_TFos1XswweiI4rdUGQ9byQ7R) and provide a response to the following question: "${question}". Please answer directly without referencing the file or vector ID.`;
        console.log('Adding message to thread:', inputMessage);
        await addMessageToThread(thread.id, inputMessage);

        // Run the assistant on the thread
        console.log('Starting assistant run');
        const run = await runAssistant(thread.id);

        // Wait for the run to complete
        await waitForRunCompletion(thread.id, run.id);

        // Retrieve the assistant's messages
        console.log('Retrieving assistant messages for chat');
        const assistantMessage = await retrieveAssistantMessages(thread.id);
        console.log('Assistant message:', assistantMessage);

        const answer = assistantMessage?.content[0].text.value || '';
        console.log('Generated answer:', answer);

        return res.status(200).json({ answer });
    } catch (error) {
        console.error('Error processing chat:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
        return res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
}
