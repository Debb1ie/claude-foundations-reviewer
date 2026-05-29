'use client';
import React from 'react';
import NextLink from 'next/link';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  SimpleGrid,
  Badge,
  Link,
} from '@chakra-ui/react';
import { DOMAINS, type Domain } from '@/types/exam';

const SVG_ICONS = {
  CLOCK: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  BOOK: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  MOON: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  TARGET: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
};

const MODES = [
  {
    id: 'exam' as const,
    title: 'Exam Mode',
    description: '60 questions, 2 hours, no explanations during test. Randomized each attempt.',
    icon: 'CLOCK' as const,
    features: ['Timed (2 hours)', 'No feedback until end', 'Randomized order', 'Progress tracking'],
  },
  {
    id: 'review' as const,
    title: 'Review Mode',
    description: 'Untimed, full feedback after each question. Learn as you go.',
    icon: 'BOOK' as const,
    features: ['Untimed', 'Show answers & explanations', 'Learn progressively', 'All questions visible'],
  },
  {
    id: 'zen' as const,
    title: 'Zen Mode',
    description: 'All exam features but no timer. Low-pressure practice.',
    icon: 'MOON' as const,
    features: ['No timer', 'Same structure as exam', 'No time pressure', 'Focus on learning'],
  },
  {
    id: 'focus' as const,
    title: 'Focus Mode',
    description: 'All questions from a single domain. Timed (1 hour).',
    icon: 'TARGET' as const,
    features: ['Single domain', '1 hour timed', 'Targeted practice', 'Domain deep dive'],
  },
];

interface ModeSelectorProps {
  onStart: (mode: 'exam' | 'review' | 'zen' | 'focus', domain?: Domain) => void;
}

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = React.useState<'exam' | 'review' | 'zen' | 'focus' | null>(null);
  const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(null);

  return (
    <Box bg="transparent" minH="100vh">
      {/* Top Header/Navigation Bar */}
      <Box borderBottom="1px solid" borderColor="border" bg="bg.panel" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.lg" py={4}>
          <HStack justify="space-between">
            <HStack gap={3}>
              <Heading as="h1" size="md" fontWeight={600} color="brand.700">
                Claude Certified Architect Exam Simulator
              </Heading>
            </HStack>
            <HStack gap={4}>
              <NextLink href="/sources" passHref legacyBehavior>
                <Link fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }}>
                  Study Resources
                </Link>
              </NextLink>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={[8, 12]}>
        <VStack gap={[8, 10]} align="stretch">
          <Box textAlign="center" maxW="2xl" mx="auto">
            <Heading as="h2" size="3xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
              Claude you prove it?
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              Select your practice mode below to begin studying for the Claude Certified Architect Foundations exam.
            </Text>
          </Box>

          {/* Grid of modes */}
          <SimpleGrid columns={[1, 1, 2, 4]} gap={5}>
            {MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <Box
                  key={mode.id}
                  as="button"
                  onClick={() => {
                    setSelectedMode(mode.id);
                    if (mode.id !== 'focus') {
                      setSelectedDomain(null);
                    }
                  }}
                  cursor="pointer"
                  border="2px solid"
                  borderColor={isSelected ? 'brand.500' : 'border'}
                  bg="bg.panel"
                  borderRadius="xl"
                  p={5}
                  textAlign="left"
                  transition="all 0.2s ease-in-out"
                  boxShadow={isSelected ? '0 10px 25px -5px rgba(57,73,171,0.15)' : '0 2px 10px rgba(0,0,0,0.02)'}
                  _hover={{ borderColor: isSelected ? 'brand.500' : 'brand.300', transform: 'translateY(-2px)' }}
                  display="flex"
                  flexDirection="column"
                  alignItems="stretch"
                  w="100%"
                >
                  <VStack gap={4} align="stretch" h="100%">
                    <HStack justify="space-between" align="center">
                      <Box
                        p={2.5}
                        borderRadius="lg"
                        bg={isSelected ? 'brand.600' : 'bg.muted'}
                        color={isSelected ? 'white' : 'brand.600'}
                        transition="all 0.2s"
                      >
                        {SVG_ICONS[mode.icon]}
                      </Box>
                      {isSelected && (
                        <Badge bg="brand.100" color="brand.700" size="sm" borderRadius="full" px={2.5}>
                          Selected
                        </Badge>
                      )}
                    </HStack>

                    <Box>
                      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1.5}>
                        {mode.title}
                      </Heading>
                      <Text fontSize="xs" color="gray.500" lineHeight={1.6} minH="50px">
                        {mode.description}
                      </Text>
                    </Box>

                    <VStack gap={2} align="stretch" mt="auto" pt={3} borderTop="1px solid" borderColor="border">
                      {mode.features.map((f) => (
                        <HStack key={f} gap={2} align="center">
                          <Box w={1.5} h={1.5} borderRadius="full" bg={isSelected ? 'accent.500' : 'brand.300'} />
                          <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Domain selector for Focus Mode */}
          {selectedMode === 'focus' && (
            <Box
              mt={4}
              p={[4, 6]}
              bg="bg.panel"
              borderRadius="xl"
              border="1px solid"
              borderColor="border"
              boxShadow="0 4px 12px rgba(0,0,0,0.01)"
            >
              <Text fontSize="sm" fontWeight={700} color="brand.700" mb={4}>
                Select Practice Domain
              </Text>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={4}>
                {DOMAINS.map((d) => {
                  const isDomainSelected = selectedDomain === d.id;
                  return (
                    <Box
                      key={d.id}
                      as="button"
                      display="flex"
                      flexDirection="column"
                      alignItems="stretch"
                      p={4}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={isDomainSelected ? d.color : 'border'}
                      bg={isDomainSelected ? `${d.color}08` : 'transparent'}
                      _hover={{ borderColor: isDomainSelected ? d.color : 'brand.400' }}
                      onClick={() => setSelectedDomain(d.id === selectedDomain ? null : d.id)}
                      transition="all 0.2s"
                      textAlign="left"
                      cursor="pointer"
                      w="100%"
                    >
                      <HStack justify="space-between" w="100%" mb={3}>
                        <Badge bg={`${d.color}15`} color={d.color} border={`1px solid ${d.color}35`} px={2} py={0.5} borderRadius="md" fontSize="2xs" fontFamily="mono" fontWeight={700}>
                          {d.id}
                        </Badge>
                        <Text fontSize="2xs" fontFamily="mono" fontWeight={700} color="gray.500">
                          {d.weight}% Weight
                        </Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight={700} color="brand.700" mb={1}>
                        {d.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {d.shortName} deep dive
                      </Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </Box>
          )}

          {/* Start CTA Button */}
          <HStack gap={4} justify="center" mt={4}>
            <Button
              size="lg"
              disabled={!selectedMode || (selectedMode === 'focus' && !selectedDomain)}
              onClick={() => {
                if (selectedMode) {
                  onStart(selectedMode, selectedMode === 'focus' ? selectedDomain! : undefined);
                }
              }}
              bg="brand.600"
              color="white"
              fontWeight={700}
              fontSize="sm"
              px={12}
              py={6}
              borderRadius="lg"
              _hover={{ bg: 'brand.700', transform: 'translateY(-1px)' }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s"
              cursor={(!selectedMode || (selectedMode === 'focus' && !selectedDomain)) ? 'not-allowed' : 'pointer'}
            >
              Start {selectedMode === 'focus' ? 'Focus practice' : selectedMode === 'zen' ? 'Zen practice' : selectedMode === 'review' ? 'Review practice' : 'Standard exam'}
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
