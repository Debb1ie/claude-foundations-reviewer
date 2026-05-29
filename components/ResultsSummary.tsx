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
  Progress,
} from '@chakra-ui/react';
import { useExamStore } from '@/hooks/useExamState';
import { DOMAINS, type Domain } from '@/types/exam';

const DOMAIN_COLORS: Record<Domain, string> = {
  D1: '#7C6EFA',  // Agentic Arch.
  D2: '#FA8C6E',  // Tool/MCP
  D3: '#6ECFFA',  // Claude Code
  D4: '#F0D06E',  // Prompt Eng.
  D5: '#A06EFA',  // Context Mgmt.
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
    <Box bg="transparent" minH="100vh" py={[8, 12]}>
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          {/* Main Results Card */}
          <Box
            bg="bg.panel"
            border="1.5px solid"
            borderColor="border"
            boxShadow="0 4px 20px rgba(0,0,0,0.02)"
            borderRadius="2xl"
            p={[6, 8]}
            textAlign="center"
          >
            <Badge
              size="md"
              px={3}
              py={1}
              borderRadius="full"
              bg={results.passed ? 'success.100' : 'error.100'}
              color={results.passed ? 'success.700' : 'error.700'}
              border="1px solid"
              borderColor={results.passed ? 'success.200' : 'error.200'}
              mb={4}
              fontSize="xs"
              fontWeight={700}
              fontFamily="mono"
            >
              {results.passed ? 'PASSED CERTIFICATION' : 'PRACTICE MORE'}
            </Badge>

            <Text
              fontSize={["5xl", "6xl"]}
              fontWeight={800}
              lineHeight={1.1}
              color={results.passed ? 'success.600' : 'error.600'}
              fontFamily="heading"
              letterSpacing="tight"
            >
              {results.score}%
            </Text>

            <Text fontSize="xs" fontFamily="mono" color="gray.400" fontWeight={600} mt={2}>
              Scaled Score Equivalent: ~{results.scaledScore}/1000 &middot; Passing Mark: 720
            </Text>

            <Heading
              as="h2"
              size="lg"
              fontWeight={700}
              mt={4}
              color="brand.700"
            >
              {results.passed
                ? 'Congratulations! You achieved a passing score.'
                : 'Keep Studying — aim for 72% or higher to guarantee success.'}
            </Heading>

            {/* Quick Stats Grid */}
            <SimpleGrid columns={[2, 4]} gap={4} mt={6} pt={6} borderTop="1px solid" borderColor="border">
              <VStack gap={0.5} align="center">
                <Text fontSize="lg" fontWeight={700} color="brand.600">{results.correctAnswers}</Text>
                <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">CORRECT</Text>
              </VStack>
              <VStack gap={0.5} align="center">
                <Text fontSize="lg" fontWeight={700} color="brand.600">{results.incorrectAnswers}</Text>
                <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">INCORRECT</Text>
              </VStack>
              <VStack gap={0.5} align="center">
                <Text fontSize="lg" fontWeight={700} color="brand.600">{results.unanswered}</Text>
                <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">UNANSWERED</Text>
              </VStack>
              <VStack gap={0.5} align="center">
                <Text fontSize="lg" fontWeight={700} color="brand.600">{timeDisplay()}</Text>
                <Text fontSize="10px" color="gray.400" fontWeight={700} fontFamily="mono">TIME TAKEN</Text>
              </VStack>
            </SimpleGrid>

            <Button
              mt={8}
              size="lg"
              bg="brand.600"
              color="white"
              fontWeight={700}
              _hover={{ bg: 'brand.700' }}
              onClick={onRestart}
              px={10}
              borderRadius="lg"
            >
              Restart Simulator
            </Button>
          </Box>

          {/* Domain Breakdown Card */}
          <Box
            bg="bg.panel"
            border="1px solid"
            borderColor="border"
            borderRadius="2xl"
            p={[6, 8]}
            boxShadow="0 2px 10px rgba(0,0,0,0.01)"
          >
            <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={5} letterSpacing="0.05em">
              DOMAIN-WISE PERFORMANCE ANALYSIS
            </Heading>

            <VStack gap={5} align="stretch">
              {DOMAINS.map((d) => {
                const breakdown = results.domainBreakdown[d.id];
                const pct = breakdown.total > 0 ? Math.round((breakdown.correct / breakdown.total) * 100) : 0;
                return (
                  <VStack key={d.id} align="stretch" gap={1.5}>
                    <HStack justify="space-between" align="center">
                      <HStack gap={2}>
                        <Badge bg={`${d.color}15`} color={d.color} border={`1px solid ${d.color}35`} px={2} py={0.5} borderRadius="md" fontSize="2xs" fontFamily="mono" fontWeight={700}>
                          {d.id}
                        </Badge>
                        <Text fontSize="xs" fontWeight={700} color="brand.700">
                          {d.name}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" fontFamily="mono" fontWeight={700} color="brand.600">
                        {breakdown.correct} / {breakdown.total} ({pct}%)
                      </Text>
                    </HStack>
                    <Progress.Root value={pct} size="sm">
                      <Progress.Track bg="border">
                        <Progress.Range bg={d.color} />
                      </Progress.Track>
                    </Progress.Root>
                  </VStack>
                );
              })}
            </VStack>
          </Box>

          {/* Incorrect Questions Review Panel */}
          {results.incorrectQuestions.length > 0 && (
            <VStack gap={4} align="stretch">
              <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1} letterSpacing="0.05em">
                DETAILED DIAGNOSTIC CHECKLIST ({results.incorrectQuestions.length} Incorrect Responses)
              </Heading>
              
              {results.incorrectQuestions.map((item, idx) => {
                const q = item.question;
                const domainColor = DOMAIN_COLORS[q.domain as Domain] || '#7C6EFA';
                const domainInfo = DOMAINS.find((d) => d.id === q.domain);
                
                return (
                  <Box
                    key={idx}
                    bg="bg.panel"
                    border="1px solid"
                    borderColor="border"
                    borderRadius="xl"
                    p={[5, 6]}
                    boxShadow="0 2px 8px rgba(0,0,0,0.01)"
                  >
                    <HStack justify="space-between" mb={3} wrap="wrap" gap={2}>
                      <HStack gap={2}>
                        <Badge
                          px={2.5}
                          py={0.5}
                          borderRadius="md"
                          bg={`${domainColor}12`}
                          color={domainColor}
                          fontFamily="mono"
                          fontSize="2xs"
                          fontWeight={700}
                          border={`1.5px solid ${domainColor}35`}
                        >
                          {q.domain}
                        </Badge>
                        {domainInfo && (
                          <Text fontSize="2xs" color="gray.500" fontFamily="mono" fontWeight={600}>
                            {domainInfo.shortName}
                          </Text>
                        )}
                      </HStack>
                      <Text fontSize="2xs" color="gray.400" fontFamily="mono" fontWeight={600}>
                        Question {questions.indexOf(q) + 1}
                      </Text>
                    </HStack>

                    {q.scenario && (
                      <Box
                        p={3.5}
                        bg="bg.muted"
                        borderLeft="3px solid"
                        borderLeftColor="brand.500"
                        borderRadius="0 md md 0"
                        mb={3}
                      >
                        <Text fontSize="xs" color="gray.600" lineHeight={1.5}>
                          {q.scenario}
                        </Text>
                      </Box>
                    )}

                    <Text fontSize="sm" color="brand.700" fontWeight={700} mb={4} lineHeight={1.5}>
                      {q.text}
                    </Text>

                    <VStack gap={2.5} align="stretch" mb={4}>
                      {q.options.map((opt, i) => {
                        let label = '';
                        let borderColor = 'border';
                        let bgColor = 'transparent';
                        let keyBg = 'transparent';
                        let keyBorderColor = 'border';
                        let keyTextColor = 'gray.400';
                        let textWeight = 500;

                        if (i === q.correctAnswer) {
                          label = 'Correct Answer';
                          borderColor = '#22c88a';
                          bgColor = '#e6f9f1';
                          keyBg = '#22c88a';
                          keyBorderColor = '#22c88a';
                          keyTextColor = 'white';
                          textWeight = 600;
                        } else if (i === item.userAnswer) {
                          label = 'Your Selection';
                          borderColor = '#f05a5a';
                          bgColor = '#fde8e8';
                          keyBg = '#f05a5a';
                          keyBorderColor = '#f05a5a';
                          keyTextColor = 'white';
                          textWeight = 600;
                        }

                        return (
                          <HStack
                            key={i}
                            p={3}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor={borderColor}
                            bg={bgColor}
                            gap={3}
                          >
                            <Box
                              w="20px"
                              h="20px"
                              borderRadius="md"
                              border="1.5px solid"
                              borderColor={keyBorderColor}
                              bg={keyBg}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexShrink={0}
                              color={keyTextColor}
                              fontFamily="mono"
                              fontSize="2xs"
                              fontWeight={700}
                            >
                              {['A', 'B', 'C', 'D'][i]}
                            </Box>
                            <Text fontSize="xs" color="gray.700" fontWeight={textWeight} flex={1} lineHeight={1.4}>
                              {opt}
                            </Text>
                            {label && (
                              <Badge
                                size="sm"
                                variant="solid"
                                bg={i === q.correctAnswer ? 'success.600' : 'error.600'}
                                color="white"
                                borderRadius="md"
                                px={2}
                                py={0.5}
                                fontSize="2xs"
                                fontWeight={700}
                                fontFamily="mono"
                              >
                                {label.toUpperCase()}
                              </Badge>
                            )}
                          </HStack>
                        );
                      })}
                    </VStack>

                    <Box
                      p={4}
                      bg="bg.muted"
                      border="1px solid"
                      borderColor="border"
                      borderRadius="xl"
                    >
                      <Heading as="h4" size="xs" color="brand.700" mb={1.5} fontFamily="mono" fontWeight={700} fontSize="xs">
                        EXPLANATION
                      </Heading>
                      <Text
                        fontSize="xs"
                        color="gray.600"
                        lineHeight={1.6}
                        dangerouslySetInnerHTML={{ __html: q.explanation }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
