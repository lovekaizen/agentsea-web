import versions from '../../data/package-versions.json';

const table: Record<string, string> = versions;

/** Version from the package's own package.json, as recorded by `npm run sync:versions`. */
export function packageVersion(npmName: string): string {
  const version = table[npmName];
  if (!version) {
    throw new Error(`No version for ${npmName} in app/data/package-versions.json. Run npm run sync:versions.`);
  }
  return version;
}
