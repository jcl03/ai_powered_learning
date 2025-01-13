"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Spinner,
  ScaleFade,
  useToast,
  Flex,
} from "@chakra-ui/react";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [topic, setTopic] = useState("artificial intelligence"); // Preset topic
  const [loading, setLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1); // Tracks the current flashcard index
  const [revealedCards, setRevealedCards] = useState([]); // Stores previously viewed flashcards
  const toast = useToast();

  const fetchFlashcards = async () => {
    if (!topic.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a topic!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setFlashcards([]); // Clear previous flashcards
    setCurrentCardIndex(-1); // Reset current card index
    setRevealedCards([]); // Clear previously revealed cards

    try {
      const response = await fetch("/api/getFlashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (response.ok) {
        setFlashcards(data.flashcards);
        if (data.flashcards.length > 0) {
          setCurrentCardIndex(0); // Start with the first card
        } else {
          toast({
            title: "No Flashcards Found",
            description: "The topic you entered did not return any flashcards.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch flashcards",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching flashcards.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch flashcards when the page loads
  useEffect(() => {
    fetchFlashcards();
  }, []); // Empty dependency array means this runs only once on mount

  const handleCardClick = () => {
    if (currentCardIndex < flashcards.length) {
      // Add the current card to revealedCards
      if (currentCardIndex >= 0 && currentCardIndex < flashcards.length) {
        setRevealedCards((prev) => [...prev, flashcards[currentCardIndex]]);
      }
      // Move to the next card
      const nextIndex = currentCardIndex + 1;
      if (nextIndex < flashcards.length) {
        setCurrentCardIndex(nextIndex);
      } else {
        setCurrentCardIndex(-1); // Indicate that all cards have been viewed
        toast({
          title: "End of Flashcards",
          description: "You have reviewed all available flashcards.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Generate Flashcards
      </Text>
      <VStack spacing={6} align="center" w="100%">
        {/* Input Section */}
        <Box w="100%" maxW="600px">
          <Input
            placeholder="Enter a topic (e.g., React, History)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            mb={4}
            display="none" // Hide the input
          />
          <Button
            onClick={fetchFlashcards}
            colorScheme="teal"
            w="100%"
            isDisabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Flashcards"}
          </Button>
        </Box>

        {/* Current Flashcard Display */}
        {currentCardIndex !== -1 && ( // Only show the box if there are flashcards to review
          <Box
            w="100%"
            maxW="600px"
            bg="gray.100"
            p={6}
            rounded="md"
            boxShadow="md"
            minHeight="200px"
            position="relative"
          >
            {loading ? (
              <Flex alignItems="center" justifyContent="center" height="100%">
                <Text fontSize="md" color="gray.600">
                  Generating flashcards...
                </Text>
              </Flex>
            ) : flashcards.length > 0 && currentCardIndex >= 0 ? (
              <ScaleFade initialScale={0.9} in={true}>
                <Box
                  p={6}
                  bg="white"
                  rounded="lg"
                  boxShadow="xl"
                  maxW="100%"
                  textAlign="center"
                  transition="transform 0.3s, box-shadow 0.3s"
                  _hover={{
                    transform: "scale(1.02)",
                    boxShadow: "2xl",
                    cursor: "pointer",
                  }}
                  onClick={handleCardClick}
                >
                  <Text fontSize="xl" fontWeight="medium" mb={3}>
                    {flashcards[currentCardIndex].question || "Keyword"}
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    {flashcards[currentCardIndex].answer || "Definition"}
                  </Text>
                </Box>
              </ScaleFade>
            ) : (
              <Flex alignItems="center" justifyContent="center" height="100%">
                <Text fontSize="md" color="gray.600">
                  No flashcards available.
                </Text>
              </Flex>
            )}
          </Box>
        )}

        {/* Previously Revealed Flashcards */}
        {revealedCards.length > 0 && (
          <Box w="100%" maxW="800px">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Flashcards:
            </Text>
            <HStack
              spacing={4}
              overflowX="auto"
              p={2}
              bg="gray.50"
              rounded="md"
            >
              {revealedCards.map((card, index) => (
                <Box
                  key={index}
                  width="250px"
                  p={4}
                  bg="white"
                  rounded="lg"
                  boxShadow="md"
                  flex="0 0 auto"
                  transition="transform 0.2s, box-shadow 0.2s"
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "lg",
                  }}
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="md" fontWeight="medium" mb={2}>
                    {card.question || "Keyword"}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {card.answer || "Definition"}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}