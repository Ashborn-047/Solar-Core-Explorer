// Lunar Missions Index
// Exports all lunar exploration missions

export { luna2 } from './luna2.js';
export { apollo11 } from './apollo11.js';
export { apollo13 } from './apollo13.js';
export { lro } from './lro.js';
export { change4 } from './change4.js';
export { chandrayaan1 } from './chandrayaan1.js';
export { chandrayaan3 } from './chandrayaan3.js';
export { artemis1 } from './artemis1.js';

// Combined array of all lunar missions
import { luna2 } from './luna2.js';
import { apollo11 } from './apollo11.js';
import { apollo13 } from './apollo13.js';
import { lro } from './lro.js';
import { change4 } from './change4.js';
import { chandrayaan1 } from './chandrayaan1.js';
import { chandrayaan3 } from './chandrayaan3.js';
import { artemis1 } from './artemis1.js';

export const LUNAR_MISSIONS = [
    luna2,
    apollo11,
    apollo13,
    lro,
    change4,
    chandrayaan1,
    chandrayaan3,
    artemis1
];
