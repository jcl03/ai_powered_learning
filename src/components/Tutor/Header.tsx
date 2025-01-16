import React from "react";
import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { FaGraduationCap } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <Box
      as="header"
      bgGradient="linear(to-r, purple.400, pink.400, blue.400)"
      py={4} // Padding for a balanced layout
      px={6}
      shadow="md"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo and Title */}
        <Flex align="center">
          {/* Logo */}
          <Box
            bg="white"
            color="purple.500"
            borderRadius="50%"
            w="50px"
            h="50px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
            mr={4}
          >
            <Icon as={FaGraduationCap} boxSize={6} color="purple.600" />
          </Box>
          {/* Title and Subtitle */}
          <Box>
            <Heading size="md" color="white" fontWeight="bold">
              AI Tutor
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.800">
              Your personalized learning companion
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
