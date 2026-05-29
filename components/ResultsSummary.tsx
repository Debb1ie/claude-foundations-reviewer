'use client';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { useExamStore } from '@/hooks/useExamState';
import { DOMAINS, type Domain } from '@/types/exam';

const DOMAIN_COLORS: Record<Domain, string> = {
  D1: '#7C6EFA',
  D2: '#FA8C6E',
  D3: '#6ECFFA',
  D4: '#F0D06E',
  D5: '#A06EFA',
};

interface ResultsSummaryProps {
  onRestart: () => void;
}

export function ResultsSummary({ onRestart }: ResultsSummaryProps) {
  const { getResults, questions } = useExamStore();
  const results = getResults();

  const timeDisplay = () => {
    const mins = Math.floor(results.timeTaken / 60);
    const secs = results.timeTaken % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <Box bg="#fafbfc" minH="100vh">
      <Container maxW="container.md" py={[8, 10]}>
        <Box
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="xl"
          p={[6, 8]}
          textAlign="center"
        >
          <Text
            fontSize={["4xl", "5xl"]}
            fontWeight={600}
            lineHeight={1}
            color={results.passed ? 'success.500' : 'error.500'}
            fontFamily="heading"
          >
            {results.score}%
          </Text>
          <Text fontSize="sm" fontFamily="mono" color="gray.400" mt={1}>
            Scaled score: ~{results.scaledScore}/1000 &middot; Minimum passing: 720
          </Text>
          <Heading
            as="h2"
            size="lg"
            fontWeight={300}
            mt={3}
            color={results.passed ? 'success.500' : 'error.500'}
          >
            {results.passed ? 'Passed' : 'Keep Studying — aim for 72%+'}
          </Heading>

          <SimpleGrid columns={[2, 3, 5]} gap={3} mt={6}>
            {DOMAINS.map((d) => {
              const breakdown = results.domainBreakdown[d.id];
              return (
                <Box
                  key={d.id}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={3}
                >
                  <Text
                    fontSize="xl"
                    fontFamily="mono"
                    fontWeight={500}
                    color={DOMAIN_COLORS[d.id]}
                  >
                    {breakdown.correct}/{breakdown.total}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontFamily="mono" mt={1}>
                    {d.shortName}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          <HStack justify="center" gap={4} mt={4} wrap="wrap">
            <Text fontSize="xs" fontFamily="mono" color="gray.400">
              {results.correctAnswers} correct &middot; {results.incorrectAnswers} incorrect &middot; {results.unanswered} unanswered
            </Text>
            <Text fontSize="xs" fontFamily="mono" color="gray.400">
              Time: {timeDisplay()}
            </Text>
          </HStack>

          <Button
            mt={6}
            size="lg"
            colorScheme="accent"
            onClick={onRestart}
          >
            Restart Exam
          </Button>
        </Box>

        {/* Incorrect questions review */}
        {results.incorrectQuestions.length > 0 && (
          <Box mt={6}>
            <Heading as="h3" size="md" fontWeight={500} color="gray.800" mb={4}>
              Review Incorrect Answers
            </Heading>
            <VStack gap={4} align="stretch">
              {results.incorrectQuestions.map((item, idx) => {
                const q = item.question;
                const domainColor = DOMAIN_COLORS[q.domain as Domain] || '#7C6EFA';
                return (
                  <Box
                    key={idx}
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={[4, 5]}
                  >
                    <HStack gap={2} mb={3}>
                      <Badge
                        px={2}
                        py={0.5}
                        borderRadius="sm"
                        bg={`${domainColor}18`}
                        color={domainColor}
                        fontFamily="mono"
                        fontSize="xs"
                        border={`1px solid ${domainColor}40`}
                      >
                        {q.domain}
                      </Badge>
                      <Text fontSize="xs" color="gray.400" fontFamily="mono">
                        Question {questions.indexOf(q) + 1}
                      </Text>
                    </HStack>
                    {q.scenario && (
                      <Text fontSize="sm" color="gray.500" mb={2} fontStyle="italic">
                        {q.scenario}
                      </Text>
                    )}
                    <Text fontSize="sm" color="gray.800" fontWeight={500} mb={3}>
                      {q.text}
                    </Text>
                    <VStack gap={1.5} align="stretch">
                      {q.options.map((opt, i) => {
                        let label = '';
                        let bgColor = 'transparent';
                        let textColor = 'gray.600';
                        if (i === q.correctAnswer) {
                          label = '(Correct)';
                          bgColor = '#e6f9f1';
                          textColor = '#22c88a';
                        } else if (i === item.userAnswer) {
                          label = '(Your answer)';
                          bgColor = '#fde8e8';
                          textColor = '#f05a5a';
                        }
                        return (
                          <HStack
                            key={i}
                            p={2}
                            borderRadius="sm"
                            bg={bgColor}
                            gap={2}
                          >
                            <Text fontSize="xs" fontFamily="mono" fontWeight={500} color="gray.400" w="16px">
                              {['A', 'B', 'C', 'D'][i]}
                            </Text>
                            <Text fontSize="sm" color={textColor} flex={1}>
                              {opt}
                            </Text>
                            {label && (
                              <Text fontSize="xs" fontFamily="mono" fontWeight={500} color={textColor}>
                                {label}
                              </Text>
                            )}
                          </HStack>
                        );
                      })}
                    </VStack>
                    <Box
                      mt={3}
                      p={3}
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                    >
                      <Text
                        fontSize="sm"
                        color="gray.700"
                        lineHeight={1.7}
                        dangerouslySetInnerHTML={{ __html: q.explanation }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
}
