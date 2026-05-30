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
import { DOMAINS, type Domain, DOMAIN_TEXT_COLORS, DOMAIN_BADGE_BGS, DOMAIN_BADGE_BORDERS, DOMAIN_SOLID_BGS, DOMAIN_SOLID_TEXT } from '@/types/exam';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } }
};

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

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
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <VStack gap={8} align="stretch">
            {/* Main Results Card */}
            <motion.div variants={itemVariants}>
              <Box
                bg="rgba(255, 255, 255, 0.45)"
                backdropFilter="blur(16px)"
                _dark={{
                  bg: "rgba(15, 23, 42, 0.45)",
                  borderColor: "rgba(255, 255, 255, 0.08)"
                }}
                border="1.5px solid"
                borderColor="rgba(255, 255, 255, 0.35)"
                boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
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
            </motion.div>

            {/* Domain Breakdown Card */}
            <motion.div variants={itemVariants}>
              <Box
                bg="rgba(255, 255, 255, 0.45)"
                backdropFilter="blur(16px)"
                _dark={{
                  bg: "rgba(15, 23, 42, 0.45)",
                  borderColor: "rgba(255, 255, 255, 0.08)"
                }}
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.35)"
                borderRadius="2xl"
                p={[6, 8]}
                boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
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
                            <Badge
                              bg={DOMAIN_SOLID_BGS[d.id]}
                              color={DOMAIN_SOLID_TEXT[d.id]}
                              border="none"
                              px={2.5}
                              py={0.5}
                              borderRadius="md"
                              fontSize="2xs"
                              fontFamily="mono"
                              fontWeight={700}
                            >
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
            </motion.div>

            {/* Incorrect Questions Review Panel */}
            {results.incorrectQuestions.length > 0 && (
              <motion.div variants={itemVariants}>
                <VStack gap={4} align="stretch">
                  <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1} letterSpacing="0.05em">
                    DETAILED DIAGNOSTIC CHECKLIST ({results.incorrectQuestions.length} Incorrect Responses)
                  </Heading>
                  
                  {results.incorrectQuestions.map((item, idx) => {
                    const q = item.question;
                    const domainColor = DOMAIN_COLORS[q.domain as Domain] || '#7C6EFA';
                    const domainInfo = DOMAINS.find((d) => d.id === q.domain);
                    
                    return (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                      >
                        <Box
                          bg="rgba(255, 255, 255, 0.45)"
                          backdropFilter="blur(12px)"
                          _dark={{
                            bg: "rgba(30, 41, 59, 0.45)",
                            borderColor: "rgba(255, 255, 255, 0.08)"
                          }}
                          border="1px solid"
                          borderColor="rgba(255, 255, 255, 0.35)"
                          borderRadius="xl"
                          p={[5, 6]}
                          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.02)"
                          transition="border-color 0.2s"
                          _hover={{ borderColor: 'brand.400' }}
                        >
                          <HStack justify="space-between" mb={3} wrap="wrap" gap={2}>
                            <HStack gap={2}>
                              <Badge
                                px={2.5}
                                py={0.5}
                                borderRadius="md"
                                bg={DOMAIN_SOLID_BGS[q.domain]}
                                color={DOMAIN_SOLID_TEXT[q.domain]}
                                fontFamily="mono"
                                fontSize="2xs"
                                fontWeight={700}
                                border="none"
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
                              bg="rgba(57, 73, 171, 0.08)"
                              border="1px solid"
                              borderColor="rgba(57, 73, 171, 0.18)"
                              borderLeft="3px solid"
                              borderLeftColor="brand.500"
                              borderRadius="lg"
                              _dark={{
                                bg: "rgba(124, 110, 250, 0.12)",
                                borderColor: "rgba(255, 255, 255, 0.12)"
                              }}
                              mb={3}
                            >
                              <HStack gap={1.5} mb={1.5} color="brand.700" _dark={{ color: "brand.300" }}>
                                <InfoIcon />
                                <Text fontFamily="mono" fontSize="2xs" fontWeight={700} textTransform="uppercase" letterSpacing="0.05em">
                                  Scenario Context
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.900" _dark={{ color: "gray.100" }} fontWeight={500} lineHeight={1.5}>
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
                            bg="rgba(57, 73, 171, 0.05)"
                            border="1px solid"
                            borderColor="rgba(57, 73, 171, 0.15)"
                            borderRadius="xl"
                            _dark={{
                              bg: "rgba(124, 110, 250, 0.08)",
                              borderColor: "rgba(255, 255, 255, 0.08)"
                            }}
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
                      </motion.div>
                    );
                  })}
                </VStack>
              </motion.div>
            )}
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
}
