// Outer Planets Missions Index
// Exports all outer Solar System exploration missions

export { voyager1 } from './voyager1.js';
export { voyager2 } from './voyager2.js';
export { cassini } from './cassini.js';
export { newhorizons } from './newhorizons.js';
export { juno } from './juno.js';

// Combined array of all outer Solar System missions
import { voyager1 } from './voyager1.js';
import { voyager2 } from './voyager2.js';
import { cassini } from './cassini.js';
import { newhorizons } from './newhorizons.js';
import { juno } from './juno.js';

export const OUTER_MISSIONS = [
    voyager1,
    voyager2,
    cassini,
    newhorizons,
    juno
];
