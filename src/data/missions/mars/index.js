// Mars Missions Index
// Exports all Mars exploration missions

export { viking1 } from './viking1.js';
export { pathfinder } from './pathfinder.js';
export { spirit } from './spirit.js';
export { opportunity } from './opportunity.js';
export { curiosity } from './curiosity.js';
export { perseverance } from './perseverance.js';
export { mangalyaan } from './mangalyaan.js';

// Combined array of all Mars missions
import { viking1 } from './viking1.js';
import { pathfinder } from './pathfinder.js';
import { spirit } from './spirit.js';
import { opportunity } from './opportunity.js';
import { curiosity } from './curiosity.js';
import { perseverance } from './perseverance.js';
import { mangalyaan } from './mangalyaan.js';

export const MARS_MISSIONS = [
    viking1,
    pathfinder,
    spirit,
    opportunity,
    curiosity,
    perseverance,
    mangalyaan
];
