import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

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
        
        if (action === 'getFeedback') {
            const threadId = req.body.threadId;
            if (!threadId || !activeThreads.has(threadId)) {
                return res.status(400).json({ error: 'Invalid thread ID' });
            }
            thread = { id: threadId };

            const wrongAnswers = answeredQuestions.filter(q => 
                q.selectedAnswer !== q.correctAnswer
            );

            const feedbackMessage = formatFeedbackPrompt(wrongAnswers);

            await openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: feedbackMessage,
            });

        } else {
            // Create new thread for quiz generation
            thread = await openai.beta.threads.create();
            activeThreads.set(thread.id, true);

            const quizMessage = `Please analyze the content from the file search (vector id: vs_TFos1XswweiI4rdUGQ9byQ7R) 
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

            await openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: quizMessage,
            });
        }

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: process.env.ASSISTANT_ID_1 || '',
        });

        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        while (runStatus.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        const messages = await openai.beta.threads.messages.list(thread.id);
        let assistantMessage = messages.data.find(msg => msg.role === 'assistant')?.content[0].text.value || '';

        // Clean up markdown symbols
        if (action === 'getFeedback') {
            // Remove markdown symbols and clean up the text
            assistantMessage = assistantMessage
                .replace(/\*\*/g, '') // Remove bold markers
                .replace(/###/g, '') // Remove heading markers
                .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
                .trim(); // Remove extra whitespace

            return res.status(200).json({ feedback: assistantMessage });
        } else {
            try {
                const parsedQuestions = JSON.parse(assistantMessage);
                return res.status(200).json({ 
                    ...parsedQuestions, 
                    threadId: thread.id 
                });
            } catch (parseError) {
                console.error('Error parsing questions:', parseError);
                return res.status(500).json({ error: 'Invalid question format received' });
            }
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: `Error ${action === 'getFeedback' ? 'generating feedback' : 'fetching quiz'}` 
        });
    }
}