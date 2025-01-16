"use client";

import React, { useState } from "react";
import {
  Text,
  VStack,
  Input,
  Button,
  Box,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please type a question!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: chatInput }),
      });

      const data = await response.json();
      if (response.ok) {
        const cleanedResponse = data.answer.replace(/【.*?】/g, "").trim();

        setChatHistory((prev) => [
          ...prev,
          { user: chatInput, bot: cleanedResponse },
        ]);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to get a response from the server.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending your question.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setChatInput(""); // Clear the input field
    }
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Chat with Your File
      </Text>

      {/* Chat History */}
      <VStack spacing={4} align="center" w="100%">
        <Box
          w="100%"
          maxW="900px"
          bg="gray.50"
          p={4}
          rounded="md"
          shadow="md"
          overflowY="auto"
          h="363px" // Fixed height for the chat history box
        >
          {chatHistory.length > 0 ? (
            chatHistory.map((chat, index) => (
              <Box key={index} mb={4}>
                {/* User Message */}
                <Text fontWeight="bold" color="teal.600">
                  You:
                </Text>
                <Text mb={2} p={2} bg="teal.100" borderRadius="md">
                  {chat.user}
                </Text>

                {/* Bot Response */}
                <Text fontWeight="bold" color="gray.700">
                  Bot:
                </Text>
                <Text p={2} bg="gray.200" borderRadius="md">
                  {chat.bot}
                </Text>
              </Box>
            ))
          ) : (
            <Text fontSize="md" color="gray.600" textAlign="center">
              Start asking questions about your uploaded file!
            </Text>
          )}
        </Box>

        {/* Input Section */}
        <Flex w="100%" maxW="600px" gap={2}>
          <Input
            placeholder="Type your question..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            isDisabled={loading}
          />
          <Button
            colorScheme="teal"
            onClick={handleChatSubmit}
            isDisabled={loading}
            leftIcon={loading ? <Spinner size="sm" /> : <FaPaperPlane />}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
