import { Box, Container, Text, Link } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box
      as="footer"
      py={6}
      borderTop="1px"
      borderColor="rgba(57,73,171,0.15)"
      bg="rgba(255,255,255,0.5)"
      backdropFilter="blur(8px)"
      mt="auto"
    >
      <Container maxW="container.lg" textAlign="center">
        <Text fontSize="sm" color="brand.500">
          Made by <Link href="https://github.com/rocketwolf98" color="brand.600" fontWeight="semibold" target="_blank" rel="noopener noreferrer">rocketwolf98</Link> from DEVCON Jumpstart Internships Program - Cohort 4. For review purposes only.
        </Text>
      </Container>
    </Box>
  );
}
