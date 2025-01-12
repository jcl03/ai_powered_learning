"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Text, Grid, GridItem, VStack, Input, HStack } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";

export default function FileUploadPanel() {
  const router = useRouter();

  const handleFileChange = (event) => {
    console.log("File input changed:", event);
    const files = Array.from(event.target.files);
    console.log("Files array:", files);

    if (files.length > 0) {
      console.log("Uploaded files:", files);
      // Redirect to /note
      router.push("/flashcards");
    } else {
      console.warn("No files selected.");
    }

    // Reset file input value to allow the same file to be uploaded again
    event.target.value = null;
  };

  return (
    <Box p={4} bg="gray.100" rounded="md" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Upload Files
      </Text>
      <Grid templateColumns="1fr" gap={4}>
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <VStack align="start" spacing={4}>
            <HStack spacing={3}>
              <FaUpload color="blue" size="24px" />
              <Text fontSize="md" fontWeight="medium">
                Upload Your Files
              </Text>
            </HStack>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              p={2}
            />
            <Text fontSize="xs" color="gray.500">
              Supported formats: PDF (.pdf) only for now
            </Text>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
