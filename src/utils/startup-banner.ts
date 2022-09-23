import os from 'os';

import gradient from 'gradient-string';

import packageJson from '../../package.json';

const osTypeMap: Record<string, any> = {
  Darwin: 'macOS',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const isTypescript =
  'typescript' in packageJson.dependencies ||
  'typescript' in packageJson.devDependencies;
const language = isTypescript ? 'typescript' : 'javascript';

const banner = `
   ____     _      __
  / __/  __(_)__ _/ /____
 / _/| |/ / / _ / __/ -_)
/___/|___/_/\_,_/\__/\__/

v${packageJson.version} (${language}) | Running on ${osTypeMap[os.type()]}
`;

export const startupBanner = () => {
  console.log(gradient.atlas(banner));
};
