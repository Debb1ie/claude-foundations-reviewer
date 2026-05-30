'use client';
import React from 'react';
import { Header } from '@/components/Header';
import { DOMAINS } from '@/types/exam';
import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Badge, Flex } from '@chakra-ui/react';

const SCENARIOS = [
  { id: 1, title: "Customer Support Resolution", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> },
  { id: 2, title: "Code Generation with Claude", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> },
  { id: 3, title: "Multi-Agent Research System", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18"></path><path d="M12 12l8.26-8.26"></path></svg> },
  { id: 4, title: "Developer Productivity", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
  { id: 5, title: "CI/CD Pipeline Integration", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg> },
  { id: 6, title: "Structured Data Extraction", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> }
];

export default function OverviewPage() {
  return (
    <Box bg="transparent" minH="100vh">
      <Header variant="subpage" />
      <Container maxW="container.lg" py={[8, 12]}>
        <VStack gap={[8, 12]} align="stretch">

          <Box textAlign="center" maxW="2xl" mx="auto">
            <Heading as="h1" size="2xl" fontWeight={800} color="brand.700" mb={4} letterSpacing="tight">
              About the Exam
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              With Claude Certified Foundations exam, you can validate your expertise in building production-grade agentic systems with Claude Code, the Claude Agent SDK, and Model Context Protocol (MCP).
            </Text>
          </Box>

          <SimpleGrid columns={[1, 1, 2]} gap={6}>
            <Box
              bg="bg.panel" borderRadius="xl" border="2px solid" borderColor="border" p={6}
              boxShadow="0 2px 10px rgba(0,0,0,0.02)"
            >
              <HStack mb={5}>
                <Box p={2.5} borderRadius="lg" bg="bg.muted" color="brand.600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </Box>
                <Heading as="h2" size="md" fontWeight={700} color="brand.700">Exam Format</Heading>
              </HStack>
              <VStack align="stretch" gap={4} pl={1}>
                <HStack gap={4}>
                  <Badge bg="bg.muted" color="brand.600" border="1px solid" borderColor="border" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs">Format</Badge>
                  <Text fontSize="sm" color="gray.600" fontWeight={500}>Multiple Choice (Scenario-based)</Text>
                </HStack>
                <HStack gap={4}>
                  <Badge bg="bg.muted" color="brand.600" border="1px solid" borderColor="border" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs">Score</Badge>
                  <Text fontSize="sm" color="gray.600" fontWeight={500}>720 passing (Scale: 100-1000)</Text>
                </HStack>
                <HStack gap={4}>
                  <Badge bg="bg.muted" color="brand.600" border="1px solid" borderColor="border" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs">Penalty</Badge>
                  <Text fontSize="sm" color="gray.600" fontWeight={500}>None for guessing</Text>
                </HStack>
                <HStack gap={4}>
                  <Badge bg="bg.muted" color="brand.600" border="1px solid" borderColor="border" minW="85px" display="flex" justifyContent="center" px={2} py={1} borderRadius="md" fontSize="xs">Scenarios</Badge>
                  <Text fontSize="sm" color="gray.600" fontWeight={500}>4 presented randomly out of 6</Text>
                </HStack>
              </VStack>
            </Box>

            <Box
              bg="bg.panel" borderRadius="xl" border="2px solid" borderColor="border" p={6}
              boxShadow="0 2px 10px rgba(0,0,0,0.02)"
              display="flex" flexDirection="column"
            >
              <HStack mb={5}>
                <Box p={2.5} borderRadius="lg" bg="bg.muted" color="brand.600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </Box>
                <Heading as="h2" size="md" fontWeight={700} color="brand.700">Target Candidate</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm" lineHeight="tall" flex={1}>
                Ideal for <strong>solution architects</strong> with 6+ months of hands-on experience designing and implementing production applications using the Claude APIs, Agent SDK, Claude Code, and MCP.
              </Text>
            </Box>
          </SimpleGrid>

          <Box>
            <Box textAlign="center" mb={6}>
              <Heading as="h2" size="xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                Knowledge Domains
              </Heading>
            </Box>
            <Box
              display="flex" flexDirection={["column", "column", "row"]} flexWrap="wrap" gap={10} alignItems="center" justifyContent="center"
              bg="bg.panel" p={[6, 10]} borderRadius="xl" border="2px solid" borderColor="border" boxShadow="0 2px 10px rgba(0,0,0,0.02)"
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

              <VStack align="stretch" gap={4} flex={1} minW="280px">
                {DOMAINS.map((domain, i) => (
                  <HStack key={i} p={2} borderRadius="lg" transition="all 0.2s" _hover={{ bg: 'bg.muted' }}>
                    <Box w="14px" h="14px" borderRadius="md" bg={domain.color} flexShrink={0} />
                    <Text flex={1} fontSize="sm" fontWeight={600} color="gray.700">{domain.name}</Text>
                    <Text fontWeight={800} color={domain.color} ml={4} fontSize="md">{domain.weight}%</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>

          <Box>
            <Box textAlign="center" mb={6}>
              <Heading as="h2" size="xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
                Exam Scenarios to Prepare
              </Heading>
              <Text color="gray.600" fontSize="md">
                The exam tests your practical judgment across these realistic production contexts.
              </Text>
            </Box>

            <SimpleGrid columns={[1, 2, 3]} gap={5}>
              {SCENARIOS.map(scenario => (
                <Box
                  key={scenario.id}
                  bg="bg.panel" p={5} borderRadius="xl" border="2px solid" borderColor="border"
                  transition="all 0.2s ease-in-out"
                  boxShadow="0 2px 10px rgba(0,0,0,0.02)"
                  _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)', boxShadow: '0 10px 25px -5px rgba(57,73,171,0.15)' }}
                >
                  <HStack align="center" gap={4}>
                    <Box p={2.5} borderRadius="lg" bg="bg.muted" color="brand.600" transition="all 0.2s">
                      <Box w="24px" h="24px" display="flex" alignItems="center" justifyContent="center">{scenario.icon}</Box>
                    </Box>
                    <Box>
                      <Badge bg="brand.100" color="brand.700" mb={1.5} size="sm" borderRadius="full" px={2.5}>
                        Scenario {scenario.id}
                      </Badge>
                      <Heading as="h3" size="sm" fontWeight={700} color="brand.700" lineHeight="1.3">
                        {scenario.title}
                      </Heading>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}
