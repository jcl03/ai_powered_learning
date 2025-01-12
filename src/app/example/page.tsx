'use client';

import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  Spinner,
  useToast,
  Flex,
  Input,
} from "@chakra-ui/react";

export default function ExamplePage() {
  const [example, setExample] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentSection, setShowCurrentSection] = useState(true);
  const toast = useToast();

  const fetchExample = async () => {
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
    resetState();

    try {
      const response = await fetch("/api/getExample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      
      if (response.ok && data.example) {
        setExample(data.example);
        const parsedSteps = parseExampleSteps(data.example);
        setSteps(parsedSteps);
      } else {
        handleError(data.error || "No example found for this topic.");
      }
    } catch (error) {
      handleError("An error occurred while fetching the example.");
    } finally {
      setLoading(false);
    }
  };

  const parseExampleSteps = (exampleText: string): string[] => {
    return exampleText
      .split('\n')
      .filter(step => step.trim() !== '' && !step.startsWith('###'))
      .map(step => step.replace(/^\d+\.\s*/, '').trim());
  };

  const resetState = () => {
    setExample("");
    setSteps([]);
    setCompletedSteps([]);
    setCurrentStep(0);
    setShowCurrentSection(true);
  };

  const handleError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, steps[currentStep]]);
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === steps.length - 1) {
      setCompletedSteps(prev => [...prev, steps[currentStep]]);
      setShowCurrentSection(false);
      handleFinish();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCompletedSteps(prev => prev.slice(0, -1));
    }
  };

  const handleFinish = () => {
    toast({
      title: "Success!",
      description: "You have completed all steps.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClear = () => {
    resetState();
    setTopic("");
  };

  const renderStepContent = (step: string) => {
    return step.split('**').map((part, index) => 
      index % 2 === 0 ? part : <strong key={index}>{part}</strong>
    );
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Generate Example
      </Text>
      <VStack spacing={6} align="center" w="100%">
        <Box w="100%" maxW="600px">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic"
            mb={4}
            size="lg"
          />
          <Button
            onClick={fetchExample}
            colorScheme="teal"
            w="100%"
            isDisabled={loading}
            size="lg"
          >
            {loading ? <Spinner size="sm" /> : "Generate Example"}
          </Button>
        </Box>

        {loading ? (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Spinner mr={4} /> Generating example...
          </Flex>
        ) : steps.length > 0 ? (
          <VStack spacing={6} w="100%" maxW="800px">
            {showCurrentSection && (
              <Box w="100%" bg="gray.100" p={6} rounded="md" boxShadow="md">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Current Step
                </Text>
                <Text fontSize="md" color="gray.700">
                  {renderStepContent(steps[currentStep])}
                </Text>
                <Flex justifyContent="space-between" mt={4}>
                  <Button
                    onClick={handlePreviousStep}
                    isDisabled={currentStep === 0}
                    colorScheme="gray"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    colorScheme="blue"
                  >
                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Flex>
              </Box>
            )}

            {completedSteps.length > 0 && (
              <Box w="100%" bg="green.50" p={6} rounded="md" boxShadow="md">
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Completed Steps
                  </Text>
                  <Button 
                    size="sm" 
                    colorScheme="red" 
                    onClick={handleClear}
                  >
                    Clear All
                  </Button>
                </Flex>
                {completedSteps.map((step, index) => (
                  <Text key={index} fontSize="md" color="gray.700" mb={2}>
                    {renderStepContent(step)}
                  </Text>
                ))}
              </Box>
            )}
          </VStack>
        ) : (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Text fontSize="md" color="gray.600">
              No example available. Enter a topic to get started.
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
