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
} from "@chakra-ui/react";

export default function ExamplePage() {
  const [example, setExample] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [showCurrentSection, setShowCurrentSection] = useState(true);

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
    setExample("");
    setSteps([]);
    setCompletedSteps([]);
    setCurrentStep(0);
    setShowCurrentSection(true);

    try {
      const response = await fetch("/api/getExample", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (response.ok) {
        setExample(data.example);
        const exampleSteps = data.example
          .split('\n')
          .filter(step => step.trim() !== '')
          .filter(step => !step.startsWith('###'))
          .map(step => {
            return step.replace(/^\d+\.\s*/, '').trim();
          });
        setSteps(exampleSteps);
        if (!data.example) {
          toast({
            title: "No Example Found",
            description: "The topic you entered did not return any example.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch example",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the example.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, steps[currentStep]]);
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      setCompletedSteps(prev => [...prev, steps[currentStep]]);
      setShowCurrentSection(false);
      handleFinish();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Process Completed",
      description: "You have completed all steps.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Additional actions can be triggered here, like redirecting
  };

  const handleClear = () => {
    setExample("");
    setSteps([]);
    setCompletedSteps([]);
    setCurrentStep(0);
    setShowCurrentSection(true);
    setTopic("");
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Generate Example
      </Text>
      <VStack spacing={6} align="center" w="100%">
        <Box w="100%" maxW="600px">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <Button
            onClick={fetchExample}
            colorScheme="teal"
            w="100%"
            isDisabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Generate Example"}
          </Button>
        </Box>

        {loading ? (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Text fontSize="md" color="gray.600">
              Generating example...
            </Text>
          </Flex>
        ) : steps.length > 0 ? (
          <VStack spacing={6} w="100%" maxW="800px">
            {showCurrentSection && (
              <Box w="100%" bg="gray.100" p={6} rounded="md" boxShadow="md">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Step: 
                  {/* {currentStep + 1}: */}
                </Text>
                <Text fontSize="md" color="gray.700">
                  {steps[currentStep].split('**').map((part, index) => 
                    index % 2 === 0 ? part : <strong key={index}>{part}</strong>
                  )}
                </Text>
                <Flex justifyContent="space-between" mt={4}>
                  <Button
                    onClick={handlePreviousStep}
                    isDisabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  {currentStep === steps.length - 1 ? (
                    <Button onClick={handleNextStep}>Finish</Button>
                  ) : (
                    <Button
                      onClick={handleNextStep}
                      isDisabled={currentStep === steps.length - 1}
                    >
                      Next
                    </Button>
                  )}
                </Flex>
              </Box>
            )}
            {completedSteps.length > 0 && (
              <Box w="100%" bg="green.50" p={6} rounded="md" boxShadow="md">
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Completed Steps:
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
                    {/* {index + 1}.  */}
                    {step.split('**').map((part, idx) => 
                      idx % 2 === 0 ? part : <strong key={idx}>{part}</strong>
                    )}
                  </Text>
                ))}
              </Box>
            )}

            
          </VStack>
        ) : (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Text fontSize="md" color="gray.600">
              No example available.
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
