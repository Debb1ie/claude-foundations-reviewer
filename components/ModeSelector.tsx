'use client';
import React from 'react';
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
} from '@chakra-ui/react';
import { DOMAINS, type Domain } from '@/types/exam';

const MODES = [
  {
    id: 'exam' as const,
    title: 'Exam Mode',
    description: '60 questions, 2 hours, no explanations during test. Randomized each attempt.',
    icon: 'CLOCK',
    features: ['Timed (2 hours)', 'No feedback until end', 'Randomized order', 'Progress tracking'],
  },
  {
    id: 'review' as const,
    title: 'Review Mode',
    description: 'Untimed, full feedback after each question. Learn as you go.',
    icon: 'BOOK',
    features: ['Untimed', 'Show answers & explanations', 'Learn progressively', 'All questions visible'],
  },
  {
    id: 'zen' as const,
    title: 'Zen Mode',
    description: 'All exam features but no timer. Low-pressure practice.',
    icon: 'MOON',
    features: ['No timer', 'Same structure as exam', 'No time pressure', 'Focus on learning'],
  },
  {
    id: 'focus' as const,
    title: 'Focus Mode',
    description: 'All questions from a single domain. Timed (1 hour).',
    icon: 'TARGET',
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
    <Box bg="white" minH="100vh">
      <Box borderBottom="1px" borderColor="gray.200" bg="white" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.lg" py={4}>
          <HStack justify="space-between">
            <HStack gap={3}>
              <Box
                px={3}
                py={1.5}
                bg="accent.50"
                borderRadius="md"
                border="1px"
                borderColor="accent.200"
              >
                <Text fontFamily="mono" fontSize="xs" fontWeight={600} color="accent.500" letterSpacing="0.15em">
                  CCA-F
                </Text>
              </Box>
              <Heading as="h1" size="md" fontWeight={500} color="gray.800">
                Claude Certified Architect
              </Heading>
            </HStack>
            <Text fontSize="xs" color="gray.400" fontFamily="mono">
              Foundations
            </Text>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={[6, 8, 10]}>
        <VStack gap={[6, 8]} align="stretch">
          <Box textAlign="center">
            <Heading as="h2" size="2xl" fontWeight={400} color="gray.800" mb={2}>
              Exam Platform
            </Heading>
            <Text color="gray.500" fontSize="md">
              Choose your mode to begin practicing for the Claude Certified Architect exam
            </Text>
          </Box>

          <SimpleGrid columns={[1, 2, 2, 4]} gap={4}>
            {MODES.map((mode) => (
              <Card.Root
                key={mode.id}
                cursor="pointer"
                borderWidth="2px"
                borderColor={selectedMode === mode.id ? 'accent.400' : 'gray.200'}
                bg={selectedMode === mode.id ? 'accent.50' : 'white'}
                onClick={() => setSelectedMode(mode.id)}
                transition="all 0.15s"
                _hover={{ borderColor: 'accent.300' }}
              >
                <Card.Body p={5}>
                  <VStack gap={3} align="stretch">
                    <Heading as="h3" size="sm" fontWeight={600} color="gray.800">
                      {mode.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.500" lineHeight={1.5}>
                      {mode.description}
                    </Text>
                    <VStack gap={1.5} align="stretch">
                      {mode.features.map((f) => (
                        <HStack key={f} gap={2}>
                          <Box w={1.5} h={1.5} borderRadius="full" bg="accent.400" />
                          <Text fontSize="xs" color="gray.500">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>

          {selectedMode === 'focus' && (
            <Box>
              <Text fontSize="sm" fontWeight={600} color="gray.700" mb={3}>
                Select Domain
              </Text>
              <HStack wrap="wrap" gap={2}>
                {DOMAINS.map((d) => (
                  <Button
                    key={d.id}
                    size="sm"
                    variant={selectedDomain === d.id ? 'solid' : 'outline'}
                    onClick={() => setSelectedDomain(d.id === selectedDomain ? null : d.id)}
                  >
                    {d.shortName}
                  </Button>
                ))}
              </HStack>
            </Box>
          )}

          <HStack gap={4} justify="center" wrap="wrap">
            <Button
              size="lg"
              colorScheme="accent"
              disabled={!selectedMode || (selectedMode === 'focus' && !selectedDomain)}
              onClick={() => {
                if (selectedMode) {
                  onStart(selectedMode, selectedMode === 'focus' ? selectedDomain! : undefined);
                }
              }}
            >
              Start {selectedMode === 'focus' ? 'Focus' : selectedMode === 'zen' ? 'Zen' : selectedMode === 'review' ? 'Review' : 'Exam'}
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
