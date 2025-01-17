// app/note/page.tsx

'use client'; // Mark this component as a Client Component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Button,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import Flashcards from '../flashcards/page'; // Import the Flashcards component
import Quiz from '../quiz/page'; // Import the Quiz component
import Example from '../example/page'; // Import the Example component
import Summary from '../summary/page'; // Import the Summary component
import Chat from '../chat/page'; // Import the Chat component
import Footer from "../../components/Tutor/Footer";
import Header from "../../components/Tutor/Header";
import { FaHome, FaQuestionCircle, FaLightbulb, FaBook, FaFileAlt, FaComment} from 'react-icons/fa'; // Import FontAwesome icons

// Define the type for module selection, including 'Home'
type ModuleType = 'Home' | 'Flashcards' | 'Quiz' | 'Example' | 'Summary' | 'Chat';

export default function NotePage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleType>('FLashcards');

  useEffect(() => {
    setIsClient(true); // Set isClient to true after the component mounts on the client
  }, []);

  // Function to render the selected module
  const renderModule = () => {
    const router = useRouter();
    switch (selectedModule) {
      case 'Home':
        // Return the Home page
        router.push('/'); // Redirect to the home page
        return null;
      case 'Flashcards':
        return <Flashcards />;
      case 'Quiz':
        return <Quiz />;
      case 'Example':
        return <Example />;
      case 'Summary':
        return <Summary />;
      case 'Chat':
        return <Chat />;
      default:
        return <Text>Module not found</Text>;
    }
  };

  return (
    <Flex width="100%" height="100vh" direction="column">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Flex width="100%" height="calc(100vh - 120px)" direction="row">
        {/* Sidebar (15% of the page width) */}
        <Box
          width="15%"
          bg="gray.200"
          p={4}
          overflowY="auto" // Enable vertical scrolling if content overflows
          minWidth="200px" // Minimum width to ensure readability
          borderRight="1px"
          borderColor="gray.300"
        >
          {/* Sidebar Navigation */}
          <VStack spacing={4} align="stretch">
            <Heading size="md" mb={4} textAlign="center">
              AI powered LMS
            </Heading>
            <Button
              leftIcon={<FaHome />}
              colorScheme={selectedModule === 'Home' ? 'teal' : 'gray'}
              onClick={() => setSelectedModule('Home')}
              width="100%" // Ensure the button takes full width for consistency
            >
              Home
            </Button>
            <Button
              leftIcon={<FaQuestionCircle />}
              colorScheme={selectedModule === 'Flashcards' ? 'teal' : 'gray'}
              onClick={() => setSelectedModule('Flashcards')}
            >
              Flashcards
            </Button>
            <Button
              leftIcon={<FaLightbulb />}
              colorScheme={selectedModule === 'Quiz' ? 'teal' : 'gray'}
              onClick={() => setSelectedModule('Quiz')}
            >
              Quiz
            </Button>
            <Button
              leftIcon={<FaBook />}
              colorScheme={selectedModule === 'Example' ? 'teal' : 'gray'}
              onClick={() => setSelectedModule('Example')}
            >
              Example
            </Button>
            <Button
              leftIcon={<FaFileAlt />}
              colorScheme={selectedModule === 'Summary' ? 'teal' : 'gray'}
              onClick={() => setSelectedModule('Summary')}
            >
              Summary
            </Button>
            <Button
              leftIcon={<FaComment />}
              colorScheme={selectedModule === 'Chat' ? 'teal' : 'gray'}
              onClick={() => setSelectedModule('Chat')}
            >
              Chat
            </Button>
          </VStack>
        </Box>

        {/* Main Content Area (85% of the page width) */}
        <Flex width="85%" direction="row">
          {/* PDF Viewer (75% of Main Content) */}
          <Box width="75%" position="relative">
            {isClient ? (
              <iframe
                src="/pdfs/note.pdf"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              >
                <p>
                  Your browser does not support PDFs. Please download the PDF to view it:{' '}
                  <a href="/pdfs/note.pdf">Download PDF</a>.
                </p>
              </iframe>
            ) : (
              <Flex
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <Text>Loading PDF viewer...</Text> {/* Fallback content during SSR */}
              </Flex>
            )}
          </Box>
          {/* Module Box (25% of Main Content) */}
          <Box
            width="30%"
            bg="gray.100"
            p={4}
            overflowY="auto" // Enable vertical scrolling if content overflows
            minWidth="250px" // Minimum width to ensure readability
            borderRight="1px"
            borderColor="gray.300"
          >
            {renderModule()}
          </Box>
        </Flex>
      </Flex>

      {/* Footer */}
      <Footer />
    </Flex>
  );
}