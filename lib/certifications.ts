import type { CertificationConfig, DomainConfig, DomainId } from '@/types/certification';
import { ccafConfig } from '@/data/certifications/cca-f/config';

// Single seam for "which certification is active" -- not a registry, since
// only one exists today. Swapping/selecting between certifications later
// only means changing what this function returns.
export function getActiveCertification(): CertificationConfig {
  return ccafConfig;
}

export function getDomain(config: CertificationConfig, id: DomainId): DomainConfig | undefined {
  return config.domains.find((d) => d.id === id);
}

export function getDomainName(config: CertificationConfig, id: DomainId): string {
  return getDomain(config, id)?.name ?? id;
}
