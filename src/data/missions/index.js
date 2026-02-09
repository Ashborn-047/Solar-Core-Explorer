// Missions Index
// Combines all mission categories into a single export

import { LUNAR_MISSIONS } from './lunar/index.js';
import { MARS_MISSIONS } from './mars/index.js';
import { OUTER_MISSIONS } from './outer/index.js';

// Re-export category arrays
export { LUNAR_MISSIONS } from './lunar/index.js';
export { MARS_MISSIONS } from './mars/index.js';
export { OUTER_MISSIONS } from './outer/index.js';

// Combined array of ALL missions
export const ALL_MISSIONS = [
    ...LUNAR_MISSIONS,
    ...MARS_MISSIONS,
    ...OUTER_MISSIONS
];

// Default export for easy importing
export default ALL_MISSIONS;
