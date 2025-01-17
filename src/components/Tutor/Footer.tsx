import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box
      as="footer"
      bgGradient="linear(to-r, blue.800, blue.600, teal.500)"
      color="white"
      py={4}
      px={6}
      textAlign="center"
      shadow="inner"
    >
      <Text fontSize="sm" opacity={0.8}>
        © {new Date().getFullYear()} Xcode. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
