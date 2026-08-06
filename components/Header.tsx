'use client';
import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Container, HStack, Heading, Link, Flex, VStack } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { getActiveCertification } from '@/lib/certifications';

const cert = getActiveCertification();

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

/** Sun/moon toggle -- flips the resolved theme, not a tri-state cycle, so
 *  one click always does the obviously-opposite thing regardless of
 *  whether "system" currently resolves light or dark. */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <Box
      as="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      p={2}
      minW="40px"
      minH="40px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="lg"
      color="gray.600"
      _dark={{ color: 'gray.300' }}
      _hover={{ bg: 'rgba(217, 119, 87, 0.1)', color: 'brand.600' }}
      outline="none"
      _focusVisible={{ boxShadow: 'outline', borderRadius: 'md' }}
      transition="all 0.15s"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Box>
  );
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Completely hide header on any active exam pages, advanced practice, or professional practice view
  const isExam = pathname?.startsWith('/exam') || pathname?.startsWith('/advanced-ccaf') || pathname?.startsWith('/professional-ccarp');
  if (isExam) {
    return null;
  }

  // Define home vs subpage variant dynamically
  const isHome = pathname === '/home' || pathname === '/';

  return (
    <Box
      borderBottom="1px solid"
      borderColor="rgba(255, 255, 255, 0.3)"
      bg="rgba(255, 255, 255, 0.45)"
      backdropFilter="blur(16px)"
      _dark={{
        bg: "rgba(35, 33, 32, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.08)"
      }}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.lg" py={4}>
        <HStack justify="space-between" align="center">
          <HStack gap={3}>
            <Link as={NextLink} href="/home" _hover={{ textDecoration: 'none' }} outline="none" _focusVisible={{ boxShadow: 'outline', borderRadius: 'md' }}>
              <Heading as="h1" size={{ base: 'sm', md: 'md' }} fontWeight={600} color="brand.700" lineHeight="1.3">
                {cert.fullName} Exam Simulator
              </Heading>
            </Link>
          </HStack>

          {/* Desktop Navigation */}
          <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
            <HStack gap={6}>
              {isHome ? (
                <>
                  <Link as={NextLink} href="/overview" p={2} fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }} outline="none" _focusVisible={{ boxShadow: 'outline', borderRadius: 'md' }}>
                    Exam Overview
                  </Link>
                  <Link as={NextLink} href="/sources" p={2} fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }} outline="none" _focusVisible={{ boxShadow: 'outline', borderRadius: 'md' }}>
                    Study Resources
                  </Link>
                </>
              ) : (
                <Link as={NextLink} href="/" p={2} fontSize="sm" fontWeight={600} color="gray.600" _hover={{ color: 'brand.600' }} outline="none" _focusVisible={{ boxShadow: 'outline', borderRadius: 'md' }}>
                  Back to Simulator
                </Link>
              )}
            </HStack>
            <ThemeToggle />
          </HStack>

          {/* Mobile Navigation Toggle */}
          <Flex display={{ base: 'flex', md: 'none' }} align="center" gap={1}>
            <ThemeToggle />
            <Box
              as="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              p={2}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              minW="44px"
              minH="44px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              outline="none"
              _focusVisible={{ boxShadow: 'outline', borderRadius: 'md' }}
              color="gray.700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </Box>
          </Flex>
        </HStack>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden', width: '100%' }}
            >
              <VStack 
                display={{ base: 'flex', md: 'none' }} 
                gap={2} 
                pt={4} 
                pb={2} 
                align="stretch"
                borderTop="1px solid"
                borderColor="border"
                mt={4}
              >
                {isHome ? (
                  <>
                    <Link as={NextLink} href="/overview"
                      py={3} 
                      px={4} 
                      fontSize="md" 
                      fontWeight={600} 
                      color="brand.700" 
                      bg="rgba(217, 119, 87, 0.08)"
                      border="1px solid"
                      borderColor="rgba(217, 119, 87, 0.18)"
                      borderRadius="md"
                      _hover={{ bg: 'rgba(217, 119, 87, 0.15)', color: 'brand.800', textDecoration: 'none' }}
                      _dark={{
                        bg: "rgba(217, 119, 87, 0.12)",
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        color: "brand.200",
                        _hover: { bg: "rgba(217, 119, 87, 0.22)", color: "white" }
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      outline="none" 
                      _focusVisible={{ boxShadow: 'outline' }}
                      display="block"
                      minH="44px"
                    >
                      Exam Overview
                    </Link>
                    <Link as={NextLink} href="/sources"
                      py={3} 
                      px={4} 
                      fontSize="md" 
                      fontWeight={600} 
                      color="brand.700" 
                      bg="rgba(217, 119, 87, 0.08)"
                      border="1px solid"
                      borderColor="rgba(217, 119, 87, 0.18)"
                      borderRadius="md"
                      _hover={{ bg: 'rgba(217, 119, 87, 0.15)', color: 'brand.800', textDecoration: 'none' }}
                      _dark={{
                        bg: "rgba(217, 119, 87, 0.12)",
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        color: "brand.200",
                        _hover: { bg: "rgba(217, 119, 87, 0.22)", color: "white" }
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      outline="none" 
                      _focusVisible={{ boxShadow: 'outline' }}
                      display="block"
                      minH="44px"
                    >
                      Study Resources
                    </Link>
                  </>
                ) : (
                  <Link as={NextLink} href="/"
                    py={3} 
                    px={4} 
                    fontSize="md" 
                    fontWeight={600} 
                    color="brand.700" 
                    bg="rgba(217, 119, 87, 0.08)"
                    border="1px solid"
                    borderColor="rgba(217, 119, 87, 0.18)"
                    borderRadius="md"
                    _hover={{ bg: 'rgba(217, 119, 87, 0.15)', color: 'brand.800', textDecoration: 'none' }}
                    _dark={{
                      bg: "rgba(217, 119, 87, 0.12)",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                      color: "brand.200",
                      _hover: { bg: "rgba(217, 119, 87, 0.22)", color: "white" }
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    outline="none" 
                    _focusVisible={{ boxShadow: 'outline' }}
                    display="block"
                    minH="44px"
                  >
                    Back to Simulator
                  </Link>
                )}
              </VStack>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
