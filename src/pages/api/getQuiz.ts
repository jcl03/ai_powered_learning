import { NextApiRequest, NextApiResponse } from 'next';
import {
    createThread,
    addMessageToThread,
    runAssistant,
    waitForRunCompletion,
    retrieveAssistantMessages,
} from '../../utils/openAIHelper';

// Store active threads in memory (consider using a proper database in production)
const activeThreads = new Map();

const formatFeedbackPrompt = (wrongAnswers) => `
Please provide detailed feedback for each wrong answer. Format your response with clear sections for each question:

${wrongAnswers.map((q, index) => `
### Question ${index + 1}:
Original Question: ${q.question}
Student's Answer: ${q.options[q.selectedAnswer]}
Correct Answer: ${q.options[q.correctAnswer]}
`).join('\n')}

For each question, please provide:
1. **Why the correct answer is right**
2. **Why the chosen answer was incorrect**
3. **Step-by-step explanation**
4. **Tip for improvement**

Please maintain this structure for each question's feedback.
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, answeredQuestions } = req.body;

    try {
        let thread;
        let inputMessage;

        if (action === 'getFeedback') {
            const threadId = req.body.threadId;
            if (!threadId || !activeThreads.has(threadId)) {
                return res.status(400).json({ error: 'Invalid thread ID' });
            }
            thread = { id: threadId };

            const wrongAnswers = answeredQuestions.filter(q => 
                q.selectedAnswer !== q.correctAnswer
            );

            inputMessage = formatFeedbackPrompt(wrongAnswers);
        } else {
            // Create new thread for quiz generation
            thread = await createThread();
            activeThreads.set(thread.id, true);

            inputMessage = `Please analyze the content from the file search (vector id: vs_TFos1XswweiI4rdUGQ9byQ7R) 
            and generate 5 multiple-choice questions about the content.
            Each question should have 4 options (A, B, C, D) with one correct answer.
            Format the response as a JSON array of questions.
            Generate new and different questions on every run.
            The response should be in this exact format:
            {
              "questions": [
                {
                  "question": "Question text here",
                  "options": {
                    "A": "First option",
                    "B": "Second option",
                    "C": "Third option",
                    "D": "Fourth option"
                  },
                  "correctAnswer": "A"
                }
              ]
            }`;
        }

        // Add the user message to the thread
        await addMessageToThread(thread.id, inputMessage);

        // Run the assistant on the thread
        const run = await runAssistant(thread.id);

        // Wait for the run to complete
        await waitForRunCompletion(thread.id, run.id);

        // Retrieve the assistant's messages
        const assistantMessage = await retrieveAssistantMessages(thread.id);
        const messageContent = assistantMessage?.content[0].text.value || '';

        if (action === 'getFeedback') {
            // Clean up markdown symbols for feedback
            const feedback = messageContent
                .replace(/\*\*/g, '') // Remove bold markers
                .replace(/###/g, '') // Remove heading markers
                .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
                .trim(); // Remove extra whitespace

            return res.status(200).json({ feedback });
        } else {
            try {
                // Attempt to parse the assistant's response as JSON
                const parsedQuestions = JSON.parse(messageContent);
                return res.status(200).json({ 
                    ...parsedQuestions, 
                    threadId: thread.id 
                });
            } catch (parseError) {
                console.error('Error parsing questions:', parseError);
                console.error('Assistant response:', messageContent);

                // If parsing fails, return an error with the assistant's raw response
                return res.status(500).json({ 
                    error: 'Invalid question format received',
                    assistantResponse: messageContent, // Include the raw response for debugging
                });
            }
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: `Error ${action === 'getFeedback' ? 'generating feedback' : 'fetching quiz'}` 
        });
    }
}