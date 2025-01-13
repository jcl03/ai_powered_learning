// app/note/page.tsx

'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import Flashcards from '../flashcards/page'; // Import the flashcards component
import Quiz from '../quiz/page'; // Import the quizs component
import Example from '../example/page'; // Import the example component
import Summary from '../summary/page'; // Import the summary component

export default function NotePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set isClient to true after the component mounts on the client
  }, []);

  return (
    <Flex width="100%" height="100vh">
      {/* PDF Viewer (75% of the page width) */}
      <Box flex="75%" position="relative">
        {isClient ? (
          <iframe
            src="/pdfs/note.pdf"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          >
            <p>Your browser does not support PDFs. Please download the PDF to view it: 
              <a href="/pdfs/note.pdf">Download PDF</a>.
            </p>
          </iframe>
        ) : (
          <p>Loading PDF viewer...</p> // Fallback content during SSR
        )}
      </Box>

      {/* Modules (25% of the page width) */}
      <Box
        flex="25%"
        bg="gray.100"
        p={4}
        overflowY="auto" // Enable vertical scrolling if content overflows
        width="25%" // Fixed width to prevent expansion
        minWidth="300px" // Minimum width to ensure readability
      >
        {/* <Flashcards /> */}
        {/* <Quiz /> */}
        <Example />
        {/* <Summary /> */}
      </Box>
    </Flex>
  );
}