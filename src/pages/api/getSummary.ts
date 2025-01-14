// api/getSummary.ts

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

    // if (!topic) {
    //     return res.status(400).json({ error: 'Topic is required' });
    // }

    try {
        // Create a new thread
        console.log('Creating new thread for summary');
        const thread = await createThread();

        // Add the user message (request for summary) to the thread
        // const inputMessage = `Please provide a concise and comprehensive summary of the topic: "${topic}". The summary should cover the key points and provide a clear understanding of the subject.`;
        const inputMessage = `Please provide a concise and comprehensive summary from the file search (vector id: vs_TFos1XswweiI4rdUGQ9byQ7R) . The summary should cover the key points and provide a clear understanding of the subject. the response shall directly start with summary, do not start with 'The file with vector ID vs_TFos1XswweiI4rdUGQ9byQ7R contains information...  DO NOT REMENTION THE FILE or VECTOR ID`;
        
        console.log('Adding message to thread:', inputMessage);
        await addMessageToThread(thread.id, inputMessage);

        // Run the assistant on the thread
        console.log('Starting assistant run');
        const run = await runAssistant(thread.id);

        // Wait for the run to complete
        await waitForRunCompletion(thread.id, run.id);

        // Retrieve the assistant's messages
        console.log('Retrieving assistant messages for summary');
        const assistantMessage = await retrieveAssistantMessages(thread.id);
        console.log('Assistant message:', assistantMessage);

        const summary = assistantMessage?.content[0].text.value || '';
        console.log('Generated summary:', summary);

        return res.status(200).json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
        return res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
}