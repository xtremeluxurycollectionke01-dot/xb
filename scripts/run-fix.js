// scripts/run-fix.js
require('ts-node').register({ transpileOnly: true });
require('tsconfig-paths/register'); // so @/ resolves
require('./fix-staff-schedules.mts');