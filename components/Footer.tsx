import { Box, Container, Text, Link } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box as="footer" py={6} borderTop="1px" borderColor="gray.100" mt="auto">
      <Container maxW="container.lg" textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Made by <Link href="https://github.com/rocketwolf98" color="accent.500" fontWeight="medium" isExternal>rocketwolf98</Link> from DEVCON Jumpstart Internships Program - Cohort 4. For review purposes only.
        </Text>
      </Container>
    </Box>
  );
}
