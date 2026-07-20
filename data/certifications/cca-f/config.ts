import type { CertificationConfig } from '@/types/certification';
import raw from './config.json';

// The actual data lives in config.json (plain JSON, no build step) so the
// export scripts (plain Node/CommonJS) can `require()` it directly without
// needing to compile TypeScript. This file only adds the type.
export const ccafConfig: CertificationConfig = raw as CertificationConfig;
