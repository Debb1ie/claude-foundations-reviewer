'use client';
import React from 'react';
import { DOMAINS, DOMAIN_TEXT_COLORS } from '@/types/exam';
import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Badge, Flex } from '@chakra-ui/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

const SCENARIOS = [
  { id: 1, title: "Customer Support Resolution", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> },
  { id: 2, title: "Code Generation with Claude", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> },
  { id: 3, title: "Multi-Agent Research System", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18"></path><path d="M12 12l8.26-8.26"></path></svg> },
  { id: 4, title: "Developer Productivity", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
  { id: 5, title: "CI/CD Pipeline Integration", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg> },
  { id: 6, title: "Structured Data Extraction", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> }
];

const DOMAIN_DETAILS: Record<string, string[]> = {
  'D1': [
    'Design and implement agentic loops for autonomous task execution',
    'Orchestrate multi-agent systems with coordinator-subagent patterns',
    'Configure subagent invocation, context passing, and spawning',
    'Implement multi-step workflows with enforcement and handoff patterns',
    'Apply Agent SDK hooks for tool call interception and data normalization',
    'Design task decomposition strategies for complex workflows',
    'Manage session state, resumption, and forking'
  ],
  'D2': [
    'Design effective tool interfaces with clear descriptions and boundaries',
    'Implement structured error responses for MCP tools',
    'Distribute tools appropriately across agents and configure tool choice',
    'Integrate MCP servers into Claude Code and agent workflows',
    'Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively'
  ],
  'D3': [
    'Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization',
    'Create and configure custom slash commands and skills',
    'Apply path-specific rules for conditional convention loading',
    'Determine when to use plan mode vs direct execution',
    'Apply iterative refinement techniques for progressive improvement',
    'Integrate Claude Code into CI/CD pipelines'
  ],
  'D4': [
    'Design prompts with explicit criteria to improve precision and reduce false positives',
    'Apply few-shot prompting to improve output consistency and quality',
    'Enforce structured output using tool use and JSON schemas',
    'Implement validation, retry, and feedback loops for extraction quality',
    'Design efficient batch processing strategies',
    'Design multi-instance and multi-pass review architectures'
  ],
  'D5': [
    'Manage conversation context to preserve critical information across long interactions',
    'Design effective escalation and ambiguity resolution patterns',
    'Implement error propagation strategies across multi-agent systems',
    'Manage context effectively in large codebase exploration',
    'Design human review workflows and confidence calibration',
    'Preserve information provenance and handle uncertainty in multi-source synthesis'
  ]
};

export default function OverviewPage() {
  const [expandedDomain, setExpandedDomain] = React.useState<string | null>(null);

  return (
    <Box bg="transparent" minH="100vh">
      <Container maxW="container.lg" py={[8, 12]}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <VStack gap={[8, 12]} align="stretch">

            <motion.div variants={itemVariants}>
              <Box textAlign="center" maxW="2xl" mx="auto">
                <Heading as="h1" size="2xl" fontWeight={800} color="brand.700" mb={4} letterSpacing="tight">
                  About the Exam
                </Heading>
                <Text color="gray.600" fontSize="lg" lineHeight="tall">
                  With Claude Certified Foundations exam, you can validate your expertise in building production-grade agentic systems with Claude Code, the Claude Agent SDK, and Model Context Protocol (MCP).
                </Text>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SimpleGrid columns={[1, 1, 2]} gap={6}>
                <Box
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(16px)"
                  _dark={{
                    bg: "rgba(15, 23, 42, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  p={6}
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                >
                  <HStack mb={5}>
                    <Box
                      p={2.5}
                      borderRadius="lg"
                      bg="rgba(57, 73, 171, 0.08)"
                      border="1px solid"
                      borderColor="rgba(57, 73, 171, 0.18)"
                      color="brand.600"
                      _dark={{
                        bg: "rgba(124, 110, 250, 0.15)",
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        color: "brand.300"
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </Box>
                    <Heading as="h2" size="md" fontWeight={700} color="brand.700">Exam Format</Heading>
                  </HStack>
                  <VStack align="stretch" gap={4} pl={1}>
                    <HStack gap={4}>
                      <Badge bg="rgba(57, 73, 171, 0.07)" color="brand.700" border="1px solid" borderColor="rgba(57, 73, 171, 0.16)" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs" _dark={{ bg: "rgba(124, 110, 250, 0.12)", color: "brand.200", borderColor: "rgba(255, 255, 255, 0.1)" }}>Format</Badge>
                      <Text fontSize="sm" color="gray.600" fontWeight={500}>Multiple Choice (Scenario-based)</Text>
                    </HStack>
                    <HStack gap={4}>
                      <Badge bg="rgba(57, 73, 171, 0.07)" color="brand.700" border="1px solid" borderColor="rgba(57, 73, 171, 0.16)" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs" _dark={{ bg: "rgba(124, 110, 250, 0.12)", color: "brand.200", borderColor: "rgba(255, 255, 255, 0.1)" }}>Score</Badge>
                      <Text fontSize="sm" color="gray.600" fontWeight={500}>720 passing (Scale: 100-1000)</Text>
                    </HStack>
                    <HStack gap={4}>
                      <Badge bg="rgba(57, 73, 171, 0.07)" color="brand.700" border="1px solid" borderColor="rgba(57, 73, 171, 0.16)" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs" _dark={{ bg: "rgba(124, 110, 250, 0.12)", color: "brand.200", borderColor: "rgba(255, 255, 255, 0.1)" }}>Penalty</Badge>
                      <Text fontSize="sm" color="gray.600" fontWeight={500}>None for guessing</Text>
                    </HStack>
                    <HStack gap={4}>
                      <Badge bg="rgba(57, 73, 171, 0.07)" color="brand.700" border="1px solid" borderColor="rgba(57, 73, 171, 0.16)" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs" _dark={{ bg: "rgba(124, 110, 250, 0.12)", color: "brand.200", borderColor: "rgba(255, 255, 255, 0.1)" }}>Scenarios</Badge>
                      <Text fontSize="sm" color="gray.600" fontWeight={500}>4 presented randomly out of 6</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(16px)"
                  _dark={{
                    bg: "rgba(15, 23, 42, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  p={6}
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  display="flex" flexDirection="column"
                >
                  <HStack mb={5}>
                    <Box
                      p={2.5}
                      borderRadius="lg"
                      bg="rgba(57, 73, 171, 0.08)"
                      border="1px solid"
                      borderColor="rgba(57, 73, 171, 0.18)"
                      color="brand.600"
                      _dark={{
                        bg: "rgba(124, 110, 250, 0.15)",
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        color: "brand.300"
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </Box>
                    <Heading as="h2" size="md" fontWeight={700} color="brand.700">Target Candidate</Heading>
                  </HStack>
                  <Text color="gray.700" _dark={{ color: "gray.100" }} fontSize="sm" fontWeight={500} lineHeight="tall" flex={1}>
                    Ideal for <strong>solution architects</strong> with 6+ months of hands-on experience designing and implementing production applications using the Claude APIs, Agent SDK, Claude Code, and MCP.
                  </Text>
                </Box>
              </SimpleGrid>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box>
                <Box textAlign="center" mb={6}>
                  <Heading as="h2" size="xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                    Knowledge Domains
                  </Heading>
                </Box>
                <Box
                  display="flex" flexDirection={["column", "column", "row"]} flexWrap="wrap" gap={10} alignItems="center" justifyContent="center"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(16px)"
                  _dark={{
                    bg: "rgba(15, 23, 42, 0.45)",
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }}
                  p={[6, 10]}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                >
                  <Box position="relative" w="220px" h="220px">
                    <svg width="100%" height="100%" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                      <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--chakra-colors-border)" strokeWidth="6"></circle>
                      {(() => {
                        const mapped = [];
                        let currentOffset = 0;
                        for (let i = 0; i < DOMAINS.length; i++) {
                          const domain = DOMAINS[i];
                          const offset = currentOffset;
                          currentOffset -= domain.weight;
                          mapped.push(
                            <circle
                              key={i} cx="21" cy="21" r="15.91549430918954" fill="transparent"
                              stroke={domain.color} strokeWidth="6"
                              strokeDasharray={`${domain.weight} ${100 - domain.weight}`}
                              strokeDashoffset={offset} style={{ transition: 'all 0.3s ease' }}
                            ></circle>
                          );
                        }
                        return mapped;
                      })()}
                    </svg>
                    <Flex position="absolute" top={0} left={0} w="100%" h="100%" align="center" justify="center" direction="column">
                      <Text fontSize="2xl" fontWeight={800} color="brand.700">100%</Text>
                      <Text fontSize="xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="widest">Total</Text>
                    </Flex>
                  </Box>

                  <VStack align="stretch" gap={2} flex={1} minW="280px">
                    {DOMAINS.map((domain, i) => (
                      <Box
                        key={i}
                        borderRadius="lg"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={expandedDomain === domain.id ? 'rgba(57, 73, 171, 0.22)' : 'transparent'}
                        bg={expandedDomain === domain.id ? 'rgba(255, 255, 255, 0.65)' : 'transparent'}
                        _dark={{
                          bg: expandedDomain === domain.id ? 'rgba(30, 41, 59, 0.5)' : 'transparent',
                          borderColor: expandedDomain === domain.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                        }}
                        backdropFilter={expandedDomain === domain.id ? 'blur(8px)' : 'none'}
                        transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                        boxShadow={expandedDomain === domain.id ? '0 4px 20px rgba(0,0,0,0.02)' : 'none'}
                      >
                        <HStack
                          p={3} 
                          cursor="pointer" 
                          onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                          _hover={{
                            bg: expandedDomain === domain.id ? 'rgba(57, 73, 171, 0.12)' : 'rgba(57, 73, 171, 0.06)',
                            _dark: {
                              bg: expandedDomain === domain.id ? 'rgba(124, 110, 250, 0.2)' : 'rgba(124, 110, 250, 0.1)'
                            }
                          }}
                          transition="all 0.2s"
                        >
                          <Box w="14px" h="14px" borderRadius="md" bg={domain.color} flexShrink={0} />
                          <Text flex={1} fontSize="sm" fontWeight={600} color="gray.700" _dark={{ color: 'gray.200' }}>{domain.name}</Text>
                          <Text fontWeight={800} color={DOMAIN_TEXT_COLORS[domain.id]} ml={2} fontSize="md">{domain.weight}%</Text>
                          <Box
                            transform={expandedDomain === domain.id ? 'rotate(180deg)' : 'none'}
                            transition="transform 0.2s"
                            color={expandedDomain === domain.id ? 'brand.600' : 'gray.500'}
                            _dark={{
                              color: expandedDomain === domain.id ? 'brand.300' : 'gray.400'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </Box>
                        </HStack>
                        <AnimatePresence initial={false}>
                          {expandedDomain === domain.id && (
                            <motion.div
                              key="domain-details"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <Box p={4} pt={2} borderTop="1px solid" borderColor="rgba(255,255,255,0.3)" bg="transparent">
                                <VStack align="stretch" gap={3}>
                                  {DOMAIN_DETAILS[domain.id].map((task, idx) => (
                                    <HStack key={idx} align="flex-start" gap={3}>
                                      <Box mt={1.5} w="5px" h="5px" borderRadius="full" bg={domain.color} flexShrink={0} opacity={0.6} />
                                      <Text fontSize="xs" color="gray.600" lineHeight={1.6} fontWeight={500}>{task}</Text>
                                    </HStack>
                                  ))}
                                </VStack>
                              </Box>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </Box>
            </motion.div>



            {/* Section 1.1: The Claude Partner Network */}
            <motion.div variants={itemVariants}>
              <Box textAlign="center" mb={4}>
                <Heading as="h2" size="xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                  Claude Partner Network
                </Heading>
                <Text color="gray.600" fontSize="md" maxW="2xl" mx="auto">
                  Anthropic&apos;s official partner program for agencies and consultancies building solutions on Claude.
                </Text>
              </Box>

              <VStack gap={6} align="stretch">
                {/* Four Academy Module Cards */}
                <SimpleGrid columns={[1, 2]} gap={4}>
                  {[
                    {
                      title: 'Agent Skills',
                      desc: 'Building AI agents with Claude, agent architecture patterns, tool use and function calling.',
                      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                    },
                    {
                      title: 'Claude API',
                      desc: 'API integration best practices, rate limits and optimization, error handling patterns.',
                      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
                    },
                    {
                      title: 'Model Context Protocol (MCP)',
                      desc: 'Connecting Claude to external tools, building custom integrations, protocol specifications.',
                      icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                    },
                    {
                      title: 'Claude Code',
                      desc: 'Using Claude for development workflows, code generation patterns, development best practices.',
                      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                    },
                  ].map((mod, idx) => (
                    <Box
                      key={idx}
                      bg="rgba(255, 255, 255, 0.45)"
                      backdropFilter="blur(12px)"
                      _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="rgba(255, 255, 255, 0.35)"
                      p={5}
                      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                    >
                      <HStack gap={3.5} align="flex-start">
                        <Box
                          p={2.5} borderRadius="lg"
                          bg="rgba(57, 73, 171, 0.08)"
                          border="1px solid" borderColor="rgba(57, 73, 171, 0.18)"
                          color="brand.600" flexShrink={0}
                          _dark={{ bg: 'rgba(124, 110, 250, 0.15)', borderColor: 'rgba(255, 255, 255, 0.12)', color: 'brand.300' }}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={mod.icon} />
                          </svg>
                        </Box>
                        <VStack align="stretch" gap={1}>
                          <Text fontSize="sm" fontWeight={700} color="brand.700">{mod.title}</Text>
                          <Text fontSize="xs" color="gray.600" lineHeight={1.5}>{mod.desc}</Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>

                {/* Registration Warning */}
                <Box
                  p={4}
                  bg="rgba(251, 191, 36, 0.08)"
                  border="1.5px solid"
                  borderColor="orange.300"
                  borderRadius="xl"
                  _dark={{ bg: 'rgba(251, 191, 36, 0.06)', borderColor: 'orange.400' }}
                >
                  <HStack align="flex-start" gap={3}>
                    <Box color="orange.500" flexShrink={0} mt={0.5}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </Box>
                    <VStack align="stretch" gap={0.5}>
                      <Text fontSize="sm" fontWeight={700} color="orange.800" _dark={{ color: 'orange.200' }}>
                        Critical: Use Company Email for Registration
                      </Text>
                      <Text fontSize="xs" color="orange.700" _dark={{ color: 'orange.300' }} lineHeight={1.5}>
                        Team members <strong>must</strong> register with their company email address. Personal accounts (Gmail, Outlook, etc.) will not count toward your organization&apos;s verification in Anthropic&apos;s system.
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Team Size Comparison */}
                <SimpleGrid columns={[1, 2]} gap={4}>
                  <Box
                    bg="rgba(255, 255, 255, 0.45)"
                    backdropFilter="blur(12px)"
                    _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    borderRadius="xl"
                    border="2px solid" borderColor="rgba(255, 255, 255, 0.35)"
                    p={5}
                  >
                    <Heading as="h3" size="xs" fontWeight={700} color="brand.700" mb={3}>
                      Team Size Guidelines
                    </Heading>
                    <Text fontSize="xs" color="gray.600" lineHeight={1.6} mb={3}>
                      The application portal mentions <strong>10 team members</strong> completing Academy courses, but the manual review process is flexible. Boutique agencies (as small as 3 people) have been accepted.
                    </Text>
                    <HStack gap={4} wrap="wrap">
                      <Badge px={2.5} py={1} borderRadius="md" bg="rgba(57,73,171,0.08)" color="brand.700" border="1px solid" borderColor="rgba(57,73,171,0.18)" fontSize="2xs" fontWeight={700}>Portal: 10+ members</Badge>
                      <Badge px={2.5} py={1} borderRadius="md" bg="rgba(34,200,138,0.1)" color="green.700" border="1px solid" borderColor="green.200" fontSize="2xs" fontWeight={700}>Confirmed: 3-person agency accepted</Badge>
                    </HStack>
                  </Box>
                  <Box
                    bg="rgba(255, 255, 255, 0.45)"
                    backdropFilter="blur(12px)"
                    _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    borderRadius="xl"
                    border="2px solid" borderColor="rgba(255, 255, 255, 0.35)"
                    p={5}
                  >
                    <Heading as="h3" size="xs" fontWeight={700} color="brand.700" mb={3}>
                      CPN Benefits
                    </Heading>
                    <VStack align="stretch" gap={2}>
                      {['Early access to new features & models', 'Co-marketing opportunities with Anthropic', 'Enhanced technical support & implementation guidance', 'Referral program access & partner community'].map((b, i) => (
                        <HStack key={i} gap={2}>
                          <Box w="5px" h="5px" borderRadius="full" bg="brand.500" flexShrink={0} />
                          <Text fontSize="xs" color="gray.600" fontWeight={500}>{b}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </SimpleGrid>
              </VStack>
            </motion.div>

            {/* Section 1.2: Exam Strategy & Preparation Tips */}
            <motion.div variants={itemVariants}>
              <Box textAlign="center" mb={4}>
                <Heading as="h2" size="xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                  Exam Strategy &amp; Preparation Tips
                </Heading>
                <Text color="gray.600" fontSize="md" maxW="2xl" mx="auto">
                  A structured approach to maximize your study efficiency and exam-day performance.
                </Text>
              </Box>

              <VStack gap={5} align="stretch">
                {/* Exam Scenarios to Prepare */}
                <Box
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(16px)"
                  _dark={{ bg: 'rgba(15, 23, 42, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                  borderRadius="xl"
                  border="2px solid" borderColor="rgba(255, 255, 255, 0.3)"
                  p={5}
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                >
                  <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={3}>
                    Exam Scenarios to Prepare
                  </Heading>
                  <Text fontSize="xs" color="gray.600" mb={4}>
                    The exam tests your practical judgment across these realistic production contexts.
                  </Text>
                  <SimpleGrid columns={[1, 2, 3]} gap={4}>
                    {SCENARIOS.map(scenario => (
                      <Box
                        key={scenario.id}
                        bg="rgba(255, 255, 255, 0.55)"
                        backdropFilter="blur(8px)"
                        _dark={{ bg: 'rgba(30, 41, 59, 0.5)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                        p={4}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.5)"
                        transition="all 0.2s"
                        _hover={{
                          borderColor: 'brand.400',
                          bg: '#ffffff',
                          _dark: { bg: 'rgba(30, 41, 59, 0.7)' },
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px 0 rgba(57, 73, 171, 0.12)'
                        }}
                      >
                        <HStack align="center" gap={3}>
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg="rgba(57, 73, 171, 0.08)"
                            border="1px solid"
                            borderColor="rgba(57, 73, 171, 0.16)"
                            color="brand.600"
                            _dark={{
                              bg: "rgba(124, 110, 250, 0.15)",
                              borderColor: "rgba(255, 255, 255, 0.12)",
                              color: "brand.300"
                            }}
                          >
                            <Box w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">{scenario.icon}</Box>
                          </Box>
                          <Box>
                            <Badge bg="brand.100" color="brand.700" mb={1} size="sm" borderRadius="full" px={2}>
                              Scenario {scenario.id}
                            </Badge>
                            <Heading as="h4" size="xs" fontWeight={700} color="brand.700" lineHeight="1.3">
                              {scenario.title}
                            </Heading>
                          </Box>
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                {/* Study Allocation */}
                <Box
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(16px)"
                  _dark={{ bg: 'rgba(15, 23, 42, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                  borderRadius="xl"
                  border="2px solid" borderColor="rgba(255, 255, 255, 0.3)"
                  p={6}
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                >
                  <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={4}>
                    High-Yield Domain Allocation
                  </Heading>
                  <Text fontSize="xs" color="gray.600" mb={4}>
                    Focus your preparation proportionally to exam weight. Domains 1 &amp; 2 represent nearly half the exam.
                  </Text>
                  <VStack gap={3} align="stretch">
                    {[
                      { label: 'Agentic Architecture & Orchestration', weight: 27, color: '#7C6EFA' },
                      { label: 'Prompt Engineering', weight: 20, color: '#F0D06E' },
                      { label: 'Claude Code Config & Workflows', weight: 20, color: '#6ECFFA' },
                      { label: 'Tool Design & MCP Integration', weight: 18, color: '#FA8C6E' },
                      { label: 'Context Management & Reliability', weight: 15, color: '#A06EFA' },
                    ].map((d, i) => (
                      <Box key={i}>
                        <HStack justify="space-between" mb={1}>
                          <HStack gap={2}>
                            <Box w="10px" h="10px" borderRadius="sm" bg={d.color} flexShrink={0} />
                            <Text fontSize="xs" fontWeight={600} color="brand.700">{d.label}</Text>
                          </HStack>
                          <Text fontSize="xs" fontFamily="mono" fontWeight={700} color="brand.600">{d.weight}%</Text>
                        </HStack>
                        <Box w="100%" h="6px" bg="border" borderRadius="full" overflow="hidden">
                          <Box h="100%" borderRadius="full" bg={d.color} w={`${d.weight}%`} transition="width 0.5s ease" />
                        </Box>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                {/* Differentiating Pillars */}
                <SimpleGrid columns={[1, 2]} gap={4}>
                  <Box
                    bg="rgba(255, 255, 255, 0.45)"
                    backdropFilter="blur(12px)"
                    _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    borderRadius="xl"
                    border="2px solid" borderColor="rgba(255, 255, 255, 0.35)"
                    p={5}
                  >
                    <HStack gap={2.5} mb={3}>
                      <Box p={2} borderRadius="lg" bg="rgba(57,73,171,0.08)" border="1px solid" borderColor="rgba(57,73,171,0.18)" color="brand.600">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </Box>
                      <Heading as="h3" size="xs" fontWeight={700} color="brand.700">Constitutional AI &amp; Safety</Heading>
                    </HStack>
                    <Text fontSize="xs" color="gray.600" lineHeight={1.6}>
                      This is where Anthropic differentiates itself. Study the Critiques &amp; Revisions loop, RLHF principles, and the Helpfulness vs. Harmlessness trade-off.                       Community test-takers consistently report this domain requiring focused attention.
                    </Text>
                  </Box>
                  <Box
                    bg="rgba(255, 255, 255, 0.45)"
                    backdropFilter="blur(12px)"
                    _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    borderRadius="xl"
                    border="2px solid" borderColor="rgba(255, 255, 255, 0.35)"
                    p={5}
                  >
                    <HStack gap={2.5} mb={3}>
                      <Box p={2} borderRadius="lg" bg="rgba(57,73,171,0.08)" border="1px solid" borderColor="rgba(57,73,171,0.18)" color="brand.600">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                        </svg>
                      </Box>
                      <Heading as="h3" size="xs" fontWeight={700} color="brand.700">MCP &amp; Multi-Agent Systems</Heading>
                    </HStack>
                    <Text fontSize="xs" color="gray.600" lineHeight={1.6}>
                      The exam covers stdio vs. SSE transport selection, capability negotiation, JSON-RPC message flow, and agent orchestration patterns. These are newer topics that appear more prominently than official domain weights suggest.
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* 7-Week Roadmap */}
                <Box
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(16px)"
                  _dark={{ bg: 'rgba(15, 23, 42, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                  borderRadius="xl"
                  border="2px solid" borderColor="rgba(255, 255, 255, 0.3)"
                  p={6}
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                >
                  <Heading as="h3" size="sm" fontWeight={700} color="brand.700" mb={4}>
                    7-Week Preparation Roadmap
                  </Heading>
                  <VStack gap={3} align="stretch">
                    {[
                      { phase: 'Weeks 1-2', title: 'Foundations', items: 'Complete Academy Modules 1 & 2 (Agent Skills, Claude API), read official API docs, set up dev environment and build simple API integrations' },
                      { phase: 'Weeks 3-4', title: 'Deep Dive', items: 'Complete Modules 3 & 4 (MCP, Claude Code), study Constitutional AI framework, build a small project using MCP and tool use, take the free 5-question sample' },
                      { phase: 'Weeks 5-6', title: 'Practice & Refine', items: 'Work through the 105-question practice set, identify weak domains and revisit docs, join community study groups, take timed mock exams' },
                      { phase: 'Week 7', title: 'Final Review', items: 'Review all domain summaries, focus on API Architecture and Prompt Engineering, rest before exam day' },
                    ].map((phase, i) => (
                      <HStack key={i} gap={4} p={3.5} borderRadius="lg" bg="rgba(57,73,171,0.04)" border="1px solid" borderColor="rgba(57,73,171,0.1)">
                        <Badge
                          px={3} py={1.5} borderRadius="md"
                          bg={['rgba(124,110,250,0.12)', 'rgba(250,140,110,0.12)', 'rgba(110,207,250,0.12)', 'rgba(240,208,110,0.12)'][i]}
                          color={['#7C6EFA', '#FA8C6E', '#6ECFFA', '#F0D06E'][i]}
                          border="1px solid" borderColor={['rgba(124,110,250,0.25)', 'rgba(250,140,110,0.25)', 'rgba(110,207,250,0.25)', 'rgba(240,208,110,0.25)'][i]}
                          fontFamily="mono" fontSize="2xs" fontWeight={700} flexShrink={0}
                        >
                          {phase.phase}
                        </Badge>
                        <VStack align="stretch" gap={0.5}>
                          <Text fontSize="xs" fontWeight={700} color="brand.700">{phase.title}</Text>
                          <Text fontSize="2xs" color="gray.600" lineHeight={1.5}>{phase.items}</Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Tactical Test-Taking Tips */}
                <Box
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{ bg: 'rgba(30, 41, 59, 0.45)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                  borderRadius="xl"
                  border="2px solid" borderColor="rgba(255, 255, 255, 0.35)"
                  p={5}
                >
                  <Heading as="h3" size="xs" fontWeight={700} color="brand.700" mb={3}>
                    Tactical Test-Taking Tips
                  </Heading>
                  <SimpleGrid columns={[1, 2]} gap={3}>
                    {[
                      'Target 1.5 minutes per scenario question — flag complex items for later review',
                      'Focus on architectural decision-making, not memorizing benchmark numbers',
                      'Read all four options before selecting — eliminate obviously wrong answers first',
                      'No penalty for guessing — always provide an answer, even if uncertain',
                      'Use the flag feature to mark uncertain questions for final review',
                      'Practice with the mock exam timer to build pacing discipline',
                    ].map((tip, i) => (
                      <HStack key={i} gap={2.5} align="flex-start">
                        <Box w="5px" h="5px" borderRadius="full" bg="brand.500" mt={1.5} flexShrink={0} />
                        <Text fontSize="xs" color="gray.600" lineHeight={1.5} fontWeight={500}>{tip}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              </VStack>
            </motion.div>

          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
}
