import { packageVersion } from './components/docs/packageVersion';

// AgentSea release shown in the site footer. It follows the core package
// version in app/data/package-versions.json, which `npm run sync:versions` writes,
// so a release only needs a sync, not a hand edit.
export const AGENTSEA_VERSION = `v${packageVersion('@lov3kaizen/agentsea-core')}`;
