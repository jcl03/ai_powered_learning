import React from 'react';
import { Box, Text, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import { FaBook, FaLightbulb, FaHighlighter, FaCheckCircle } from 'react-icons/fa';

export default function OverviewPanel() {
  return (
    <Box p={4} bg="gray.100" rounded="md" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Overview of Features
      </Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {/* Flashcards */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaBook color="blue" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Flashcards</Text>
              <Text fontSize="2xl" color="blue.500">Memorize Key Facts</Text>
              <Text fontSize="xs" color="gray.500">Interactive learning aids</Text>
            </VStack>
          </HStack>
        </GridItem>

        {/* Example Guide */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaLightbulb color="green" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Example Guide</Text>
              <Text fontSize="2xl" color="green.500">Learn by Examples</Text>
              <Text fontSize="xs" color="gray.500">Practical examples to explore</Text>
            </VStack>
          </HStack>
        </GridItem>

        {/* Summarization */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaHighlighter color="orange" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Summarization</Text>
              <Text fontSize="2xl" color="orange.500">Key Insights</Text>
              <Text fontSize="xs" color="gray.500">Get concise summaries</Text>
            </VStack>
          </HStack>
        </GridItem>

        {/* Test Yourself */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaCheckCircle color="purple" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Test Yourself</Text>
              <Text fontSize="2xl" color="purple.500">Assess Skills</Text>
              <Text fontSize="xs" color="gray.500">Interactive quizzes and challenges</Text>
            </VStack>
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
