// page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  Spinner,
  useToast,
  Flex,
} from "@chakra-ui/react";

export default function SummaryPage() {
  const [summary, setSummary] = useState<string>("");
  const [topic, setTopic] = useState("."); // Preset topic
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchSummary = async () => {
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
    setSummary(""); // Clear previous summary

    try {
      const response = await fetch("/api/getSummary", { // Updated endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
        if (!data.summary) {
          toast({
            title: "No Summary Found",
            description: "The topic you entered did not return any summary.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch summary",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the summary.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

//   // Automatically fetch summary when the page loads
//   useEffect(() => {
//     fetchSummary();
//   }, []); // Empty dependency array means this runs only once on mount

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Summary
      </Text>
      <VStack spacing={6} align="center" w="100%">
        {/* Input Section */}
        <Box w="100%" maxW="600px">
          {/* You can choose to keep the input visible for dynamic topic changes */}
          <Button
            onClick={fetchSummary}
            colorScheme="teal"
            w="100%"
            isDisabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Generate Summary"}
          </Button>
        </Box>

        {/* Summary Display */}
        {loading ? (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Text fontSize="md" color="gray.600">
              Generating summary...
            </Text>
          </Flex>
        ) : summary ? (
          <Box
            w="100%"
            maxW="800px"
            bg="gray.100"
            p={6}
            rounded="md"
            boxShadow="md"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Summary:
            </Text>
            <Text fontSize="md" color="gray.700">
              {summary}
            </Text>
          </Box>
        ) : (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Text fontSize="md" color="gray.600">
              No summary available.
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
