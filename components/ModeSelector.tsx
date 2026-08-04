'use client';
import type { Domain } from '@/types/exam';
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { getActiveCertification } from '@/lib/certifications';

const cert = getActiveCertification();
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import React from 'react';

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
  TARGET: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  STAR: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  CERT: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M9 13.5 7 22l5-3 5 3-2-8.5"></path>
    </svg>
  ),
};
const MODES = [
  {
    id: 'exam' as const,
    title: 'Exam Mode',
    description: '60 questions, no explanations during the test. Randomized each attempt.',
    icon: 'CLOCK' as const,
    features: ['Randomized order', 'No feedback until end', 'Full results summary', 'Progress tracking'],
    cta: 'Begin Exam',
  },
];

interface ModeSelectorProps {
  onStart: (mode: 'exam' | 'review' | 'zen' | 'focus', domain?: Domain) => void;
}

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = React.useState<'exam' | 'review' | 'zen' | 'focus' | null>(null);
  const [examTimed, setExamTimed] = React.useState<boolean>(true);
  const [showAdvancedWarning, setShowAdvancedWarning] = React.useState(false);
  const [showProfessionalWarning, setShowProfessionalWarning] = React.useState(false);

  // Navigates to the mode's own landing page, which is always the real
  // gate -- it shows the intro/rules screen and only starts the timed,
  // fullscreen session (and requests fullscreen) once its own Start
  // Practice button is clicked there.
  const beginAdvancedPractice = () => {
    setShowAdvancedWarning(false);
    router.push('/advanced-ccaf');
  };

  const beginProfessionalPractice = () => {
    setShowProfessionalWarning(false);
    router.push('/professional-ccarp');
  };

  return (
    <Box bg="transparent" minH="100vh">
      <Container maxW="container.lg" py={[8, 12]}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <VStack gap={[8, 10]} align="stretch">
            <motion.div variants={itemVariants}>
              <Box textAlign="center" maxW="2xl" mx="auto">
                <Heading as="h2" size="3xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                  Claude you Ace?
                </Heading>
                <Text color="gray.600" fontSize="lg" lineHeight="tall">
                  Select your practice mode below to begin studying for the {cert.fullName} exam.
                </Text>
              </Box>
            </motion.div>

            {/* Grid of modes */}
            <SimpleGrid columns={[1, 2, 4]} gap={5}>
              {/* Review Resources card — links to /sources */}
              <motion.div
                key="review-resources"
                variants={itemVariants}
                style={{ display: 'flex', width: '100%' }}
              >
                <Link
                  as={NextLink}
                  href="/sources"
                  w="100%"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: "rgba(30, 41, 59, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  p={5}
                  textAlign="left"
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px 0 rgba(57, 73, 171, 0.12)',
                    textDecoration: 'none'
                  }}
                  display="flex"
                  flexDirection="column"
                  style={{ textDecoration: 'none' }}
                >
                  <VStack gap={4} align="stretch" h="100%">
                    <HStack justify="space-between" align="center">
                      <Box
                        p={2.5}
                        borderRadius="lg"
                        bg="rgba(57, 73, 171, 0.08)"
                        border="1px solid"
                        borderColor="rgba(57, 73, 171, 0.16)"
                        color="brand.600"
                        transition="all 0.2s"
                        _dark={{
                          bg: 'rgba(124, 110, 250, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.12)',
                          color: 'brand.300'
                        }}
                      >
                        {SVG_ICONS.BOOK}
                      </Box>
                    </HStack>

                    <Box>
                      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1.5}>
                        Review Resources
                      </Heading>
                      <Text fontSize="xs" color="gray.500" lineHeight={1.6} minH="50px">
                        Access curated study materials, official docs, and community guides.
                      </Text>
                    </Box>

                    <VStack gap={2} align="stretch" pt={3} borderTop="1px solid" borderColor="border">
                      {['Official study guides', 'API documentation', 'Community resources', 'Exam tips & strategy'].map((f) => (
                        <HStack key={f} gap={2} align="center">
                          <Box w={1.5} h={1.5} borderRadius="full" bg="accent.500" />
                          <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    <Button
                      mt="auto"
                      w="100%"
                      size="sm"
                      bg="brand.600"
                      color="white"
                      fontWeight={700}
                      borderRadius="lg"
                      _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(57,73,171,0.35)' }}
                      transition="all 0.2s"
                    >
                      Browse Resources
                    </Button>
                  </VStack>
                </Link>
              </motion.div>

              {MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <motion.div
                    key={mode.id}
                    variants={itemVariants}
                    style={{ display: 'flex', width: '100%' }}
                  >
                    <Box
                      onClick={() => setSelectedMode(mode.id)}
                      cursor="pointer"
                      border="2px solid"
                      borderColor={isSelected ? 'brand.500' : 'rgba(255, 255, 255, 0.35)'}
                      bg={isSelected ? 'rgba(57, 73, 171, 0.06)' : 'rgba(255, 255, 255, 0.45)'}
                      backdropFilter="blur(12px)"
                      _dark={{
                        bg: isSelected ? 'rgba(124, 110, 250, 0.1)' : 'rgba(30, 41, 59, 0.45)',
                        borderColor: isSelected ? 'brand.500' : 'rgba(255, 255, 255, 0.08)'
                      }}
                      borderRadius="xl"
                      p={5}
                      textAlign="left"
                      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                      boxShadow={isSelected ? '0 10px 25px -5px rgba(57,73,171,0.15)' : '0 8px 32px 0 rgba(31, 38, 135, 0.03)'}
                      _hover={{
                        borderColor: isSelected ? 'brand.500' : 'brand.300',
                        bg: isSelected ? 'rgba(57, 73, 171, 0.08)' : 'rgba(255, 255, 255, 0.65)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px 0 rgba(57, 73, 171, 0.12)'
                      }}
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
                            bg={isSelected ? 'brand.600' : 'rgba(57, 73, 171, 0.08)'}
                            border={isSelected ? 'none' : '1px solid'}
                            borderColor={isSelected ? 'transparent' : 'rgba(57, 73, 171, 0.16)'}
                            color={isSelected ? 'white' : 'brand.600'}
                            transition="all 0.2s"
                            _dark={isSelected ? {} : {
                              bg: 'rgba(124, 110, 250, 0.15)',
                              borderColor: 'rgba(255, 255, 255, 0.12)',
                              color: 'brand.300'
                            }}
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

                        <VStack gap={2} align="stretch" pt={3} borderTop="1px solid" borderColor="border">
                          {mode.features.map((f) => (
                            <HStack key={f} gap={2} align="center">
                              <Box w={1.5} h={1.5} borderRadius="full" bg={isSelected ? 'accent.500' : 'brand.300'} />
                              <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                            </HStack>
                          ))}
                        </VStack>

                        <VStack gap={2} align="stretch" mt="auto">
                          <>
                              {/* Timer toggle for Exam Mode */}
                              <Box
                                mt={2}
                                p={3}
                                borderRadius="lg"
                                bg="rgba(57, 73, 171, 0.04)"
                                border="1px solid"
                                borderColor="rgba(57, 73, 171, 0.12)"
                                _dark={{ bg: 'rgba(124, 110, 250, 0.08)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                              >
                                <Text fontSize="2xs" fontWeight={700} color="gray.500" textTransform="uppercase" letterSpacing="0.06em" mb={2}>
                                  Timer
                                </Text>
                                <HStack gap={1.5} w="100%">
                                  <Box
                                    as="button"
                                    flex={1}
                                    py={1.5}
                                    borderRadius="md"
                                    fontSize="xs"
                                    fontWeight={700}
                                    border="1.5px solid"
                                    borderColor={examTimed ? 'brand.500' : 'rgba(57, 73, 171, 0.16)'}
                                    bg={examTimed ? 'brand.600' : 'transparent'}
                                    color={examTimed ? 'white' : 'gray.500'}
                                    transition="all 0.18s"
                                    _hover={{ borderColor: 'brand.400' }}
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setExamTimed(true); }}
                                  >
                                    Timed · 2h
                                  </Box>
                                  <Box
                                    as="button"
                                    flex={1}
                                    py={1.5}
                                    borderRadius="md"
                                    fontSize="xs"
                                    fontWeight={700}
                                    border="1.5px solid"
                                    borderColor={!examTimed ? 'brand.500' : 'rgba(57, 73, 171, 0.16)'}
                                    bg={!examTimed ? 'brand.600' : 'transparent'}
                                    color={!examTimed ? 'white' : 'gray.500'}
                                    transition="all 0.18s"
                                    _hover={{ borderColor: 'brand.400' }}
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setExamTimed(false); }}
                                  >
                                    No Timer
                                  </Box>
                                </HStack>
                              </Box>
                              <Button
                                mt={2}
                                w="100%"
                                size="sm"
                                bg={isSelected ? 'brand.600' : 'brand.500'}
                                color="white"
                                fontWeight={700}
                                borderRadius="lg"
                                _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(57,73,171,0.35)' }}
                                transition="all 0.2s"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStart(examTimed ? 'exam' : 'zen');
                                }}
                              >
                                {examTimed ? 'Begin Timed Exam' : 'Begin Without Timer'}
                              </Button>
                            </>
                        </VStack>
                      </VStack>
                    </Box>
                  </motion.div>
                );
              })}

              {/* Advanced Practice card */}
              <motion.div
                key="advanced-practice"
                variants={itemVariants}
                style={{ display: 'flex', width: '100%' }}
              >
                <Box
                  w="100%"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: "rgba(30, 41, 59, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  p={5}
                  textAlign="left"
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px 0 rgba(57, 73, 171, 0.12)',
                  }}
                  display="flex"
                  flexDirection="column"
                >
                  <VStack gap={4} align="stretch" h="100%">
                    <HStack justify="space-between" align="center">
                      <Box
                        p={2.5}
                        borderRadius="lg"
                        bg="rgba(57, 73, 171, 0.08)"
                        border="1px solid"
                        borderColor="rgba(57, 73, 171, 0.16)"
                        color="brand.600"
                        transition="all 0.2s"
                        _dark={{
                          bg: 'rgba(124, 110, 250, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.12)',
                          color: 'brand.300'
                        }}
                      >
                        {SVG_ICONS.STAR}
                      </Box>
                    </HStack>

                    <Box>
                      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1.5}>
                        Advanced Practice (CCAF)
                      </Heading>
                      <Text fontSize="xs" color="gray.500" lineHeight={1.6} minH="50px">
                        60 challenging questions covering all Claude Certified Architect – Foundations exam domains.
                      </Text>
                    </Box>

                    <VStack gap={2} align="stretch" pt={3} borderTop="1px solid" borderColor="border">
                      {['60 advanced questions', 'All 5 domains', 'Harder scenarios', 'Detailed explanations'].map((f) => (
                        <HStack key={f} gap={2} align="center">
                          <Box w={1.5} h={1.5} borderRadius="full" bg="accent.500" />
                          <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    <VStack mt="auto" gap={2} align="stretch">
                      <Button
                        w="100%"
                        size="sm"
                        bg="brand.600"
                        color="white"
                        fontWeight={700}
                        borderRadius="lg"
                        _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(57,73,171,0.35)' }}
                        transition="all 0.2s"
                        onClick={() => setShowAdvancedWarning(true)}
                      >
                        Start Advanced Practice
                      </Button>
                    </VStack>
                  </VStack>
                </Box>
              </motion.div>

              {/* Professional Exam Practice card */}
              <motion.div
                key="professional-practice"
                variants={itemVariants}
                style={{ display: 'flex', width: '100%' }}
              >
                <Box
                  w="100%"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{
                    bg: "rgba(30, 41, 59, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  p={5}
                  textAlign="left"
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px 0 rgba(57, 73, 171, 0.12)',
                  }}
                  display="flex"
                  flexDirection="column"
                >
                  <VStack gap={4} align="stretch" h="100%">
                    <HStack justify="space-between" align="center">
                      <Box
                        p={2.5}
                        borderRadius="lg"
                        bg="rgba(57, 73, 171, 0.08)"
                        border="1px solid"
                        borderColor="rgba(57, 73, 171, 0.16)"
                        color="brand.600"
                        transition="all 0.2s"
                        _dark={{
                          bg: 'rgba(124, 110, 250, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.12)',
                          color: 'brand.300'
                        }}
                      >
                        {SVG_ICONS.CERT}
                      </Box>
                    </HStack>

                    <Box>
                      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={1.5}>
                        Professional Mode (CCARP)
                      </Heading>
                      <Text fontSize="xs" color="gray.500" lineHeight={1.6} minH="50px">
                        Scenario-based questions for the Professional-level (CCARP) certification, including select-two and scenario matching.
                      </Text>
                    </Box>

                    <VStack gap={2} align="stretch" pt={3} borderTop="1px solid" borderColor="border">
                      {['Single, multi-select & matching', 'Timed, fullscreen practice', 'Domain breakdown results', 'Detailed explanations'].map((f) => (
                        <HStack key={f} gap={2} align="center">
                          <Box w={1.5} h={1.5} borderRadius="full" bg="accent.500" />
                          <Text fontSize="11px" fontWeight={500} color="gray.600">{f}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    <VStack mt="auto" gap={2} align="stretch">
                      <Button
                        w="100%"
                        size="sm"
                        bg="brand.600"
                        color="white"
                        fontWeight={700}
                        borderRadius="lg"
                        _hover={{ bg: 'brand.700', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(57,73,171,0.35)' }}
                        transition="all 0.2s"
                        onClick={() => setShowProfessionalWarning(true)}
                      >
                        Start Professional Practice
                      </Button>
                    </VStack>
                  </VStack>
                </Box>
              </motion.div>
            </SimpleGrid>

            <motion.div variants={itemVariants}>
              <Box mt={4} p={5} bg="rgba(255, 255, 255, 0.45)" backdropFilter="blur(12px)" _dark={{ bg: "rgba(30, 41, 59, 0.45)", borderColor: "rgba(255, 255, 255, 0.08)" }} border="1px solid" borderColor="rgba(255, 255, 255, 0.35)" borderRadius="xl">
                <Text fontSize="xs" color="gray.500" textAlign="justify" lineHeight="tall">
                  <strong>Disclaimer:</strong> This Claude Certified Architect Reviewer is an independent educational initiative created by Kenshin Juanico &amp; Precious Manucom from the DEVCON Jumpstart AI Engineering Interns based on public resources, Reddit community reviews, and official study guides. It is not affiliated with, endorsed by, or connected to Anthropic PBC or Skilljar, and it strictly adheres to non-disclosure policies by not reproducing actual live exam questions. Because AI technologies and certification requirements evolve rapidly, this material is intended solely for preparatory study and does not guarantee exam success; users must always verify the latest exam domains, updates, and training modules directly by visiting the official portal at <Link href="https://anthropic.skilljar.com/" target="_blank" rel="noopener noreferrer" color="brand.500" textDecoration="underline">https://anthropic.skilljar.com/</Link>.
                </Text>
              </Box>
            </motion.div>
          </VStack>
        </motion.div>
      </Container>

      {/* Advanced Practice rules warning, shown before the session starts */}
      <AnimatePresence>
        {showAdvancedWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(10,14,40,0.72)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ duration: 0.22 }}
              style={{ width: '100%', maxWidth: '480px' }}
            >
              <Box
                bg="rgba(255,255,255,0.97)"
                _dark={{ bg: 'rgba(20,30,58,0.98)' }}
                borderRadius="2xl"
                border="1px solid rgba(255,255,255,0.35)"
                boxShadow="0 24px 64px rgba(10,14,40,0.35)"
                overflow="hidden"
                p={[6, 7]}
              >
                <Heading size="md" fontWeight={800} color="brand.700" mb={1} _dark={{ color: 'gray.100' }}>
                  Before you start
                </Heading>
                <Text fontSize="sm" color="gray.500" mb={5}>
                  Advanced Practice (CCAF) enforces a few rules to make your score mean something:
                </Text>
                <VStack align="stretch" gap={3} mb={6}>
                  {[
                    'This runs in fullscreen. Leaving fullscreen wipes your answers and restarts you from Question 1.',
                    'Switching tabs, alt-tabbing, or taking a screenshot triggers a warning banner.',
                    'Each question has its own time limit -- 60s for standard questions, 105s for the harder tier. When it runs out, the question is skipped automatically, answered or not.',
                    'The review screen hides answer options and correct answers for anything you skip -- you only see what you actually attempted.',
                  ].map((line, i) => (
                    <HStack key={i} align="flex-start" gap={2.5}>
                      <Box w="6px" h="6px" borderRadius="full" bg="brand.500" mt="7px" flexShrink={0} />
                      <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.300' }} lineHeight={1.5}>
                        {line}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
                <HStack justify="flex-end" gap={3} pt={4} borderTop="1px solid" borderColor="rgba(0,0,0,0.06)" _dark={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Button variant="outline" size="sm" onClick={() => setShowAdvancedWarning(false)} fontWeight={600} color="gray.700" _dark={{ color: 'gray.300' }}>
                    Cancel
                  </Button>
                  <Button bg="brand.600" color="white" _hover={{ bg: 'brand.700' }} size="sm" onClick={beginAdvancedPractice} fontWeight={700}>
                    I Understand — Start
                  </Button>
                </HStack>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Exam Practice rules warning, shown before the session starts */}
      <AnimatePresence>
        {showProfessionalWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(10,14,40,0.72)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ duration: 0.22 }}
              style={{ width: '100%', maxWidth: '480px' }}
            >
              <Box
                bg="rgba(255,255,255,0.97)"
                _dark={{ bg: 'rgba(20,30,58,0.98)' }}
                borderRadius="2xl"
                border="1px solid rgba(255,255,255,0.35)"
                boxShadow="0 24px 64px rgba(10,14,40,0.35)"
                overflow="hidden"
                p={[6, 7]}
              >
                <Heading size="md" fontWeight={800} color="brand.700" mb={1} _dark={{ color: 'gray.100' }}>
                  Before you start
                </Heading>
                <Text fontSize="sm" color="gray.500" mb={5}>
                  Professional Mode (CCARP) enforces a few rules to make your score mean something:
                </Text>
                <VStack align="stretch" gap={3} mb={6}>
                  {[
                    'This runs in fullscreen. Leaving fullscreen wipes your answers and restarts you from Question 1.',
                    'Switching tabs, alt-tabbing, or taking a screenshot triggers a warning banner.',
                    'Some questions are multi-select ("Select TWO") -- pick exactly two, then hit Confirm Selection to lock it in. Once two are checked, the rest close until you uncheck one. Single-answer questions lock the moment you click.',
                    'Scenario Matching questions ask you to match each requirement to an option -- assign all rows, then hit Confirm Matches.',
                    'Each question has its own time limit. When it runs out, the question is skipped automatically, answered or not.',
                    'The review screen hides answer options and correct answers for anything you skip -- you only see what you actually attempted.',
                  ].map((line, i) => (
                    <HStack key={i} align="flex-start" gap={2.5}>
                      <Box w="6px" h="6px" borderRadius="full" bg="brand.500" mt="7px" flexShrink={0} />
                      <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.300' }} lineHeight={1.5}>
                        {line}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
                <HStack justify="flex-end" gap={3} pt={4} borderTop="1px solid" borderColor="rgba(0,0,0,0.06)" _dark={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Button variant="outline" size="sm" onClick={() => setShowProfessionalWarning(false)} fontWeight={600} color="gray.700" _dark={{ color: 'gray.300' }}>
                    Cancel
                  </Button>
                  <Button bg="brand.600" color="white" _hover={{ bg: 'brand.700' }} size="sm" onClick={beginProfessionalPractice} fontWeight={700}>
                    I Understand — Start
                  </Button>
                </HStack>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
