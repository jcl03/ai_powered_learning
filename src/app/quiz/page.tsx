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

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentSection, setShowCurrentSection] = useState(true);
  const toast = useToast();
  const [feedback, setFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const handleAnswerSelect = (option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedAnswers[currentQuestion]) {
      toast({
        title: "Select an Answer",
        description: "Please select an answer before proceeding.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const currentQuestionData = {
      ...questions[currentQuestion],
      selectedAnswer: selectedAnswers[currentQuestion]
    };

    if (currentQuestion < questions.length - 1) {
      setAnsweredQuestions(prev => [...prev, currentQuestionData]);
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === questions.length - 1) {
      setAnsweredQuestions(prev => [...prev, currentQuestionData]);
      setShowCurrentSection(false);
      handleFinish();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
    const correctAnswers = questions.filter((q, index) => 
      selectedAnswers[index] === q.correctAnswer
    ).length;
    
    toast({
      title: "Quiz Completed",
      description: `You got ${correctAnswers} out of ${questions.length} correct!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleClear = () => {
    setQuestions([]);
    setAnsweredQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowCurrentSection(true);
    setFeedback("");
    setThreadId(null);
  };

  const fetchQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setAnsweredQuestions([]);
    setCurrentQuestion(0);
    setShowCurrentSection(true);
    setFeedback("");
    setThreadId(null);

    try {
      const response = await fetch("/api/getQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: 'getQuiz' }),
      });

      const data = await response.json();
      if (response.ok) {
        setQuestions(data.questions);
        setThreadId(data.threadId);
        if (!data.questions?.length) {
          toast({
            title: "No Questions Found",
            description: "No questions were generated.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch quiz",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the quiz.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    if (!showResults || !threadId) {
      toast({
        title: "Complete Quiz First",
        description: "Please complete the quiz to get feedback.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoadingFeedback(true);
    try {
      const response = await fetch("/api/getQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: 'getFeedback',
          threadId,
          answeredQuestions 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setFeedback(data.feedback);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to get feedback",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while getting feedback.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingFeedback(false);
    }
  };

  const renderFeedbackSection = (feedbackText: string) => {
    // Split feedback into sections for each question
    const sections = feedbackText.split(/(?=Question \d+:)/).filter(Boolean);

    return sections.map((section, index) => {
      const lines = section.split('\n').filter(Boolean);
      const questionTitle = lines[0]; // "Question X:"
      const feedbackPoints = lines.slice(1); // Rest of the feedback

      return (
        <Box
          key={index}
          bg="purple.50"
          p={6}
          rounded="md"
          boxShadow="md"
          borderWidth="1px"
          borderColor="purple.200"
          mb={4}
        >
          <Text fontSize="lg" fontWeight="bold" color="purple.700" mb={4}>
            {questionTitle}
          </Text>
          
          {feedbackPoints.map((point, pointIndex) => {
            if (point.startsWith('-')) {
              const [title, ...content] = point.substring(2).split(':');
              return (
                <Box key={pointIndex} mb={3}>
                  <Text fontWeight="bold" color="purple.600">
                    {title}:
                  </Text>
                  <Text color="gray.700" ml={4}>
                    {content.join(':')}
                  </Text>
                </Box>
              );
            }
            return null;
          })}
        </Box>
      );
    });
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Quiz
      </Text>
      <VStack spacing={6} align="center" w="100%">
        <Box w="100%" maxW="600px">
          <Button
            onClick={fetchQuiz}
            colorScheme="teal"
            w="100%"
            isDisabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Generate Quiz"}
          </Button>
        </Box>

        {loading ? (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Text fontSize="md" color="gray.600">
              Generating quiz...
            </Text>
          </Flex>
        ) : questions.length > 0 ? (
          <VStack spacing={6} w="100%" maxW="800px">
            {showCurrentSection && (
              <Box w="100%" bg="gray.100" p={6} rounded="md" boxShadow="md">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Question {currentQuestion + 1}:
                </Text>
                <Text fontSize="md" color="gray.700" mb={4}>
                  {questions[currentQuestion].question}
                </Text>
                <VStack spacing={3} align="stretch" mb={4}>
                  {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
                    <Button
                      key={key}
                      onClick={() => handleAnswerSelect(key)}
                      colorScheme={selectedAnswers[currentQuestion] === key ? "blue" : "gray"}
                      variant={selectedAnswers[currentQuestion] === key ? "solid" : "outline"}
                      justifyContent="flex-start"
                      height="auto"
                      py={2}
                      whiteSpace="normal"
                      textAlign="left"
                    >
                      <Text>
                        <strong>{key}:</strong> {value}
                      </Text>
                    </Button>
                  ))}
                </VStack>
                <Flex justifyContent="space-between" mt={4}>
                  <Button
                    onClick={handlePreviousQuestion}
                    isDisabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  {currentQuestion === questions.length - 1 ? (
                    <Button onClick={handleNextQuestion} colorScheme="green">
                      Finish
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion} colorScheme="blue">
                      Next
                    </Button>
                  )}
                </Flex>
              </Box>
            )}
            {answeredQuestions.length > 0 && (
              <Box w="100%" bg="green.50" p={6} rounded="md" boxShadow="md">
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Answered Questions:
                  </Text>
                  <Button 
                    size="sm" 
                    colorScheme="red" 
                    onClick={handleClear}
                  >
                    Clear All
                  </Button>
                </Flex>
                {answeredQuestions.map((q, index) => (
                  <Box key={index} mb={4} p={3} bg="white" rounded="md">
                    <Text fontSize="md" color="gray.700" mb={2}>
                      {q.question}
                    </Text>
                    <Text fontSize="sm" color={q.selectedAnswer === q.correctAnswer ? "green.500" : "red.500"}>
                      Your answer: {q.options[q.selectedAnswer]} 
                      {showResults && q.selectedAnswer !== q.correctAnswer && 
                        ` (Correct: ${q.options[q.correctAnswer]})`
                      }
                    </Text>
                  </Box>
                ))}

                {showResults && (
                  <VStack spacing={4} mt={6} w="100%">
                    <Button
                      onClick={handleGetFeedback}
                      colorScheme="purple"
                      size="lg"
                      w="100%"
                      isLoading={loadingFeedback}
                      loadingText="Generating Feedback"
                    >
                      Get Detailed Feedback
                    </Button>
                    
                    {feedback && (
                      <Box w="100%" mt={4}>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>
                          Personalized Feedback:
                        </Text>
                        {renderFeedbackSection(feedback)}
                      </Box>
                    )}
                  </VStack>
                )}
              </Box>
            )}
          </VStack>
        ) : (
          <Flex alignItems="center" justifyContent="center" height="200px">
            <Text fontSize="md" color="gray.600">
              No questions available.
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
