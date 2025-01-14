"use client";

import { Box, Text, Flex } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Keyframes for a subtle fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <Box
      w="100%"
      bgGradient="linear(to-r, teal.500, blue.500)"
      py={10}
      px={6}
      boxShadow="md"
      textAlign="center"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        animation={`${fadeIn} 0.8s ease-out`}
      >
        <Text
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
          color="white"
          bgClip="text"
          lineHeight="tall"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="whiteAlpha.800"
            mt={2}
          >
            {subtitle}
          </Text>
        )}
      </Flex>
    </Box>
  );
}