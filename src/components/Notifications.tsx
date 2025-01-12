import { Box, Heading, Text, VStack, Badge } from "@chakra-ui/react";

const Notifications = () => {
  const notifications = [
    { id: 1, message: "New flashcard set available: AI Basics", type: "info" },
    { id: 2, message: "Upcoming quiz reminder: Complete by Friday", type: "warning" },
    { id: 3, message: "Congratulations! You've completed the Summarization module", type: "success" },
    { id: 4, message: "System update scheduled for this weekend", type: "info" },
  ];

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Notifications</Heading>
      <VStack align="stretch" spacing={3}>
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            p={4}
            bg={notification.type === "warning" ? "yellow.50" : "gray.50"}
            borderRadius="md"
            borderLeftWidth="4px"
            borderColor={
              notification.type === "info"
                ? "blue.300"
                : notification.type === "warning"
                ? "yellow.300"
                : "green.300"
            }
          >
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              {notification.message}
            </Text>
            <Badge
              colorScheme={
                notification.type === "info"
                  ? "blue"
                  : notification.type === "warning"
                  ? "yellow"
                  : "green"
              }
            >
              {notification.type}
            </Badge>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Notifications;
