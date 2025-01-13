// app/note/page.tsx

'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { Flex, Button, Box } from '@chakra-ui/react';

export default function NotePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set isClient to true after the component mounts on the client
  }, []);

  return (
    <Flex width="100%" height="100vh">
      {/* PDF Viewer (70% of the page width) */}
      <Box flex="7" position="relative">
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

      {/* Button Tray (30% of the page width) */}
      <Flex
        flex="3"
        direction="column"
        align="center"
        justify="center"
        bg="gray.100"
        p={4}
        gap={4}
      >
        <Button colorScheme="blue" width="100%">
          Button 1
        </Button>
        <Button colorScheme="green" width="100%">
          Button 2
        </Button>
        <Button colorScheme="red" width="100%">
          Button 3
        </Button>
      </Flex>
    </Flex>
  );
}