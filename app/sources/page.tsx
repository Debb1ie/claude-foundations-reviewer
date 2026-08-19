'use client';

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  SimpleGrid,
} from '@chakra-ui/react';
import { getActiveCertification } from '@/lib/certifications';

const cert = getActiveCertification();

const FEATURED_LINKS = [
  {
    title: 'CCA-F Study Guide (Tutorials Dojo)',
    description: 'A comprehensive written study guide covering the Claude Certified Architect - Foundations exam domains, format, and key concepts.',
    url: 'https://tutorialsdojo.com/ccar-f-claude-certified-architect-foundations-study-guide/',
    category: 'Top Recommended'
  },
  {
    title: 'CCA-F Video Course (Tutorials Dojo)',
    description: 'A full video course walking through the Claude Certified Architect - Foundations certification, from Tutorials Dojo\'s training portal.',
    url: 'https://portal.tutorialsdojo.com/courses/claude-certified-architect-foundations-ccar-f-video-course/',
    category: 'Top Recommended'
  },
  {
    title: 'Claude Certification Guide - Learn',
    description: 'Recommended by recent passers: structured learning content covering the CCA-F exam domains.',
    url: 'https://claudecertificationguide.com/learn',
    category: 'Recommended by Passers'
  },
  {
    title: 'Claude Certification Guide - Mock Exam',
    description: 'Recommended by recent passers: a full-length mock exam to test your readiness before sitting the real thing.',
    url: 'https://claudecertificationguide.com/mock-exam',
    category: 'Recommended by Passers'
  },
  {
    title: 'CyberSkill Practice',
    description: 'Recommended by recent passers: practice questions and exercises to reinforce key certification concepts.',
    url: 'https://practice.cyberskill.world/',
    category: 'Recommended by Passers'
  },
  {
    title: 'CertSafari',
    description: 'Recommended by recent passers: additional certification prep resources and practice material.',
    url: 'https://www.certsafari.com/',
    category: 'Recommended by Passers'
  },
];

const PARTNER_LINKS = [
  {
    title: 'Anthropic Partner Portal',
    description: 'Exclusive hub access for Claude Partner Network members. Your primary destination for partner resources.',
    url: 'https://partnerhub.anthropic.com/signin/anthropic',
    category: 'Partner Portal'
  },
  {
    title: 'Claude Partner Network Learning Path',
    description: 'The official Skilljar learning path for the Claude Partner Network program — essential for partners completing certification requirements.',
    url: 'https://anthropic-partners.skilljar.com/',
    category: 'Partner Academy'
  },
  {
    title: 'Introduction to Model Context Protocol',
    description: 'A dedicated Skilljar course on MCP — understanding protocol specifications, transport selection, and building custom integrations.',
    url: 'https://anthropic-partners.skilljar.com/introduction-to-model-context-protocol',
    category: 'Partner Academy'
  },
];

const SOURCES = [
  {
    title: `${cert.fullName} Exam Guide`,
    description: `The official comprehensive PDF guide detailing the scope, format, and topics covered in the ${cert.shortName} certification exam.`,
    url: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F8lsy243ftffjjy1cx9lm3o2bw%2Fpublic%2F1773274827%2FClaude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf',
    category: 'Official Docs'
  },
  {
    title: 'Official Claude API Documentation',
    description: 'Comprehensive documentation on how to integrate and build with the Claude API.',
    url: 'https://docs.anthropic.com/en/api/getting-started',
    category: 'Official Docs'
  },
  {
    title: 'Learn Anthropic (Skilljar)',
    description: 'Anthropic\'s official learning platform containing courses and modules to help you master Claude.',
    url: 'https://learn.anthropic.com/',
    category: 'Courses'
  },
  {
    title: 'Prompt Engineering Guide',
    description: 'Best practices, techniques, and strategies for writing effective prompts for Claude.',
    url: 'https://docs.anthropic.com/en/docs/prompt-engineering',
    category: 'Guides'
  },
  {
    title: 'Anthropic Educational Courses (GitHub)',
    description: 'Open-source educational materials, notebooks, and examples provided by Anthropic.',
    url: 'https://github.com/anthropics/courses',
    category: 'Courses'
  },
  {
    title: 'Anthropic Cookbook',
    description: 'A collection of recipes and code examples for building with Claude.',
    url: 'https://github.com/anthropics/anthropic-cookbook',
    category: 'Code Examples'
  },
  {
    title: 'Claude System Prompts',
    description: 'Documentation on system prompts and how to effectively steer Claude\'s behavior.',
    url: 'https://docs.anthropic.com/en/docs/system-prompts',
    category: 'Guides'
  },
  {
    title: 'Claude Certifications Exam Guide (Unofficial)',
    description: `An unofficial guide to help you prepare for the ${cert.fullName} certification.`,
    url: 'https://claudecertifications.com/claude-certified-architect/exam-guide',
    category: 'Community Resources'
  },
  {
    title: 'Claude Certification Guide - Diagnostic',
    description: 'A diagnostic tool to help you assess your readiness and identify gaps before taking the certification exam.',
    url: 'https://claudecertificationguide.com/learn/diagnostic',
    category: 'Community Resources'
  },
  {
    title: 'CCAF Reference',
    description: 'A community-built reference guide covering key concepts for the Claude Certified Architect - Foundations certification.',
    url: 'https://ccaf-reference.vercel.app/',
    category: 'Community Resources'
  }
];

export default function SourcesPage() {
  return (
    <Box bg="transparent" minH="100vh">
      <Container maxW="container.lg" py={[8, 12]}>
        <VStack gap={[8, 10]} align="stretch">
          <Box textAlign="center" maxW="2xl" mx="auto">
            <Heading as="h2" size="3xl" fontWeight={800} color="brand.700" mb={3} letterSpacing="tight">
              Study Resources
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              A curated collection of official documentation, guides, and courses to help you prepare with the Claude Certified Exams Reviewer.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="lg" fontWeight={700} color="brand.700" mb={5}>
              ⭐ Certified Passer Recommendation
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
              {FEATURED_LINKS.map((source, idx) => (
                <Link
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  border="2px solid"
                  borderColor="rgba(200, 154, 63, 0.5)"
                  bg="rgba(255, 251, 240, 0.65)"
                  backdropFilter="blur(12px)"
                  _dark={{ bg: "rgba(60, 48, 20, 0.35)", borderColor: "rgba(223, 190, 114, 0.4)", _hover: { bg: "rgba(60, 48, 20, 0.55)", borderColor: "#DFBE72" } }}
                  borderRadius="xl"
                  p={6}
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(200, 154, 63, 0.08)"
                  _hover={{
                    borderColor: '#C89A3F',
                    bg: 'rgba(255, 251, 240, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px 0 rgba(200, 154, 63, 0.18)',
                    textDecoration: 'none'
                  }}
                  display="flex"
                  flexDirection="column"
                  style={{ textDecoration: 'none' }}
                >
                  <HStack justify="space-between" mb={3}>
                    <Box
                      px={2.5}
                      py={1}
                      borderRadius="full"
                      bg="rgba(200, 154, 63, 0.18)"
                      _dark={{ bg: 'rgba(223,190,114,0.2)', color: '#F3DFAE' }}
                      color="#856224"
                      fontSize="xs"
                      fontWeight={700}
                      fontFamily="mono"
                    >
                      {source.category}
                    </Box>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="#C89A3F">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </HStack>

                  <Heading as="h3" size="md" fontWeight={700} color="brand.700" mb={2}>
                    {source.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" lineHeight={1.6} flex={1}>
                    {source.description}
                  </Text>
                </Link>
              ))}
            </SimpleGrid>
          </Box>

          <Box>
            <Heading as="h3" size="lg" fontWeight={700} color="brand.700" mb={5}>
              Exclusive Partner Network and Priority Links to Check
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
              {PARTNER_LINKS.map((source, idx) => (
                <Link
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{ bg: "rgba(35, 33, 32, 0.45)", borderColor: "rgba(255, 255, 255, 0.08)", _hover: { bg: "rgba(50, 47, 45, 0.75)", borderColor: "brand.400" } }}
                  borderRadius="xl"
                  p={6}
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px 0 rgba(217, 119, 87, 0.1)',
                    textDecoration: 'none'
                  }}
                  display="flex"
                  flexDirection="column"
                  style={{ textDecoration: 'none' }}
                >
                  <HStack justify="space-between" mb={3}>
                    <Box
                      px={2.5}
                      py={1}
                      borderRadius="full"
                      bg="brand.100"
                      _dark={{ bg: 'rgba(204,120,92,0.15)', color: '#E5BA9E' }}
                      color="brand.700"
                      fontSize="xs"
                      fontWeight={700}
                      fontFamily="mono"
                    >
                      {source.category}
                    </Box>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="var(--chakra-colors-gray-400)">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </HStack>

                  <Heading as="h3" size="md" fontWeight={700} color="brand.700" mb={2}>
                    {source.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" lineHeight={1.6} flex={1}>
                    {source.description}
                  </Text>
                </Link>
              ))}
            </SimpleGrid>
          </Box>

          <Box>
            <Heading as="h3" size="lg" fontWeight={700} color="brand.700" mb={5}>
              Other Links
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
              {SOURCES.map((source, idx) => (
                <Link
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.35)"
                  bg="rgba(255, 255, 255, 0.45)"
                  backdropFilter="blur(12px)"
                  _dark={{ bg: "rgba(35, 33, 32, 0.45)", borderColor: "rgba(255, 255, 255, 0.08)", _hover: { bg: "rgba(50, 47, 45, 0.75)", borderColor: "brand.400" } }}
                  borderRadius="xl"
                  p={6}
                  transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.03)"
                  _hover={{
                    borderColor: 'brand.400',
                    bg: 'rgba(255, 255, 255, 0.65)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px 0 rgba(217, 119, 87, 0.1)',
                    textDecoration: 'none'
                  }}
                  display="flex"
                  flexDirection="column"
                  style={{ textDecoration: 'none' }}
                >
                  <HStack justify="space-between" mb={3}>
                    <Box
                      px={2.5}
                      py={1}
                      borderRadius="full"
                      bg="brand.100"
                      _dark={{ bg: 'rgba(204,120,92,0.15)', color: '#E5BA9E' }}
                      color="brand.700"
                      fontSize="xs"
                      fontWeight={700}
                      fontFamily="mono"
                    >
                      {source.category}
                    </Box>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="var(--chakra-colors-gray-400)">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </HStack>

                  <Heading as="h3" size="md" fontWeight={700} color="brand.700" mb={2}>
                    {source.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" lineHeight={1.6} flex={1}>
                    {source.description}
                  </Text>
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
