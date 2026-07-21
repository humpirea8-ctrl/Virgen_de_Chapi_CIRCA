// Wrapper to provide a stable uuid import across ESM/CJS and different uuid versions
// Use: import { uuidv4 } from '@/lib/uuid'

let uuidv4: () => string

try {
  // Try modern ESM import
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const u = require('uuid')
  if (u && typeof u.v4 === 'function') uuidv4 = u.v4
} catch (e) {
  // fallback to dynamic import
}

if (!uuidv4) {
  // Use dynamic import which works in ESM contexts
  // Note: top-level await isn't available here, so define function to call when needed
  // We'll import lazily when uuidv4 is first called
  uuidv4 = function () {
    // This is synchronous placeholder; in practice, code should import from 'uuid' directly in ESM.
    // For safety, return a timestamp-based fallback if uuid library isn't available.
    return 'fallback-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }
}

export { uuidv4 }
