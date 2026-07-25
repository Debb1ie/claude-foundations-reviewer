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
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useExamStore } from '@/hooks/useExamState';
import { DOMAINS, DOMAIN_TEXT_COLORS, DOMAIN_BADGE_BGS, DOMAIN_BADGE_BORDERS, DOMAIN_SOLID_BGS, DOMAIN_SOLID_TEXT, isMultiSelect, isAnswerSelected } from '@/types/exam';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { getActiveCertification } from '@/lib/certifications';
import { PasserTips } from '@/components/PasserTips';

const cert = getActiveCertification();

const QUICK_RESOURCES = [
  {
    label: 'Official Docs',
    title: `${cert.shortName} Exam Guide`,
    description: 'Official PDF covering all exam domains, weights, and format.',
    url: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F8lsy243ftffjjy1cx9lm3o2bw%2Fpublic%2F1773274827%2FClaude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf',
    icon: 'pdf',
  },
  {
    label: 'Essentials',
    title: 'Claude Partner Network Path',
    description: 'Official Skilljar learning path required for certification.',
    url: 'https://anthropic.skilljar.com/page/claude-partner-network-learning-path',
    icon: 'course',
  },
  {
    label: 'Courses',
    title: 'Learn Anthropic (Skilljar)',
    description: "Anthropic's official platform with all Claude courses and modules.",
    url: 'https://learn.anthropic.com/',
    icon: 'learn',
  },
  {
    label: 'Guides',
    title: 'Prompt Engineering Guide',
    description: 'Best practices and strategies for writing effective Claude prompts.',
    url: 'https://docs.anthropic.com/en/docs/prompt-engineering',
    icon: 'guide',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
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
                  {results.passed ? 'PASSED MOCK EXAMS' : 'PRACTICE MORE'}
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
                  size="md"
                  fontWeight={700}
                  mt={4}
                  color="brand.700"
                >
                  {results.passed
                    ? 'Mock Exam Success!'
                    : 'Keep Pushing Forward'}
                </Heading>

                <Text fontSize="sm" color="gray.600" lineHeight={1.7} mt={3} textAlign="left" px={[0, 2]}>
                  {results.passed
                    ? 'Congratulations on passing the Claude certificate mock exam! While this is a great milestone, keep in mind that the actual exam can be more challenging, so stay focused on your preparation. Be sure to leverage our review kit, catch the latest podcast episodes, and consult the official Claude Partner Network resources for the most up-to-date information. Your consistency here is exactly what will help you cross the finish line with confidence.'
                    : "You're doing great for your first few attempts! While you aren't quite there yet, treat this as a solid foundation to build on. Stay consistent with the review kit and official resources, and you'll definitely bridge that gap. Keep up the momentum — review the incorrect answers below and focus on the domains where you scored lowest."}
                </Text>

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

            {/* Tips from those who passed */}
            <motion.div variants={itemVariants}>
              <PasserTips />
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

            {/* Quick Resources — shown only on fail */}
            {!results.passed && (
              <motion.div variants={itemVariants}>
                <Box
                  bg="rgba(255, 241, 241, 0.55)"
                  backdropFilter="blur(16px)"
                  _dark={{
                    bg: "rgba(60, 20, 20, 0.35)",
                    borderColor: "rgba(255, 100, 100, 0.15)"
                  }}
                  border="1.5px solid"
                  borderColor="rgba(240, 90, 90, 0.22)"
                  borderRadius="2xl"
                  p={[6, 8]}
                  boxShadow="0 8px 32px 0 rgba(240, 90, 90, 0.06)"
                >
                  <HStack justify="space-between" align="center" mb={5} wrap="wrap" gap={3}>
                    <VStack align="flex-start" gap={0.5}>
                      <Heading as="h3" size="sm" fontWeight={700} color="error.700" _dark={{ color: 'red.300' }} letterSpacing="0.05em">
                        RECOMMENDED RESOURCES
                      </Heading>
                      <Text fontSize="xs" color="gray.500">Start here to close the gap before your next attempt.</Text>
                    </VStack>
                    <Link
                      as={NextLink}
                      href="/sources"
                      fontSize="xs"
                      fontWeight={700}
                      color="brand.600"
                      _hover={{ color: 'brand.700', textDecoration: 'underline' }}
                    >
                      View all resources →
                    </Link>
                  </HStack>

                  <SimpleGrid columns={[1, 2]} gap={4}>
                    {QUICK_RESOURCES.map((r) => (
                      <Link
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="flex"
                        flexDirection="column"
                        p={4}
                        borderRadius="xl"
                        border="1.5px solid"
                        borderColor="rgba(255, 255, 255, 0.4)"
                        bg="rgba(255, 255, 255, 0.55)"
                        backdropFilter="blur(10px)"
                        _dark={{
                          bg: 'rgba(30, 41, 59, 0.45)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}
                        transition="all 0.22s cubic-bezier(0.4,0,0.2,1)"
                        _hover={{
                          borderColor: 'brand.400',
                          bg: 'rgba(255,255,255,0.8)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(57,73,171,0.10)',
                          textDecoration: 'none'
                        }}
                        style={{ textDecoration: 'none' }}
                      >
                        <HStack justify="space-between" mb={2}>
                          <Badge
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            bg="brand.100"
                            color="brand.700"
                            fontSize="2xs"
                            fontWeight={700}
                            fontFamily="mono"
                          >
                            {r.label}
                          </Badge>
                          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="var(--chakra-colors-gray-400)">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </HStack>
                        <Text fontSize="sm" fontWeight={700} color="brand.700" mb={1}>{r.title}</Text>
                        <Text fontSize="xs" color="gray.500" lineHeight={1.5}>{r.description}</Text>
                      </Link>
                    ))}
                  </SimpleGrid>
                </Box>
              </motion.div>
            )}

            {/* Incorrect Questions Review Panel */}
            {results.incorrectQuestions.length > 0 && (
              <motion.div variants={itemVariants}>
                <VStack gap={4} align="stretch">
                  <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1} letterSpacing="0.05em">
                    DETAILED DIAGNOSTIC CHECKLIST ({results.incorrectQuestions.length} Incorrect Responses)
                  </Heading>
                  
                  {results.incorrectQuestions.map((item, idx) => {
                    const q = item.question;
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

                              const isCorrectOpt = isMultiSelect(q)
                                ? (q.correctAnswers ?? []).includes(i)
                                : i === q.correctAnswer;
                              const isUserSel = isAnswerSelected(item.userAnswer, i);
                              if (isCorrectOpt) {
                                label = 'Correct Answer';
                                borderColor = '#22c88a';
                                bgColor = '#e6f9f1';
                                keyBg = '#22c88a';
                                keyBorderColor = '#22c88a';
                                keyTextColor = 'white';
                                textWeight = 600;
                              } else if (isUserSel) {
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
                                    {isMultiSelect(q) && isAnswerSelected(item.userAnswer, i) ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  ) : (
                                    ['A', 'B', 'C', 'D'][i]
                                  )}
                                  </Box>
                                  <Text fontSize="xs" color="gray.700" fontWeight={textWeight} flex={1} lineHeight={1.4}>
                                    {opt}
                                  </Text>
                                    {label && (
                                      <Badge
                                        size="sm"
                                        variant="solid"
                                        bg={label === 'Correct Answer' ? 'success.600' : 'error.600'}
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

            <motion.div variants={itemVariants}>
              <Box mt={4} p={5} bg="rgba(255, 255, 255, 0.45)" backdropFilter="blur(12px)" _dark={{ bg: "rgba(30, 41, 59, 0.45)", borderColor: "rgba(255, 255, 255, 0.08)" }} border="1px solid" borderColor="rgba(255, 255, 255, 0.35)" borderRadius="xl">
                <Text fontSize="xs" color="gray.500" textAlign="justify" lineHeight="tall">
                  <strong>Disclaimer:</strong> This Claude Certified Architect Reviewer is an independent educational initiative created by the DEVCON Jumpstart AI Engineering Interns based on public resources, Reddit community reviews, and official study guides. It is not affiliated with, endorsed by, or connected to Anthropic PBC or Skilljar, and it strictly adheres to non-disclosure policies by not reproducing actual live exam questions. Because AI technologies and certification requirements evolve rapidly, this material is intended solely for preparatory study and does not guarantee exam success; users must always verify the latest exam domains, updates, and training modules directly by visiting the official portal at <Link href="https://anthropic.skilljar.com/" target="_blank" rel="noopener noreferrer" color="brand.500" textDecoration="underline">https://anthropic.skilljar.com/</Link>.
                </Text>
              </Box>
            </motion.div>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
}
