import { Box, Container, Text, Link } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box
      as="footer"
      py={{ base: 8, md: 6 }}
      borderTop="1px solid"
      borderColor="rgba(255, 255, 255, 0.3)"
      bg="rgba(255, 255, 255, 0.45)"
      backdropFilter="blur(16px)"
      _dark={{
        bg: "rgba(15, 23, 42, 0.45)",
        borderColor: "rgba(255, 255, 255, 0.08)"
      }}
      mt="auto"
    >
      <Container maxW="container.lg" textAlign="center">
        <Text fontSize={{ base: "xs", md: "sm" }} color="brand.500" px={4} lineHeight="tall">
          Made by <Link href="https://github.com/rocketwolf98" color="brand.600" fontWeight="semibold" target="_blank" rel="noopener noreferrer" outline="none" _focusVisible={{ boxShadow: "outline", borderRadius: "sm" }}>rocketwolf98</Link> from DEVCON Jumpstart Internships Program - Cohort 4. For review purposes only.
        </Text>
      </Container>
    </Box>
  );
}
