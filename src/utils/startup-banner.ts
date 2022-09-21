import os from 'os';

import gradient from 'gradient-string';

import packageJson from '../../package.json';

// Map os.type() to a frieldy name
const osTypeMap: Record<string, any> = {
  Darwin: 'macOS',
  Linux: 'Linux',
  Windows_NT: 'Windows'
};

const banner = `
   ____     _      __     
  / __/  __(_)__ _/ /____ 
 / _/| |/ / / _ / __/ -_)
/___/|___/_/\_,_/\__/\__/

v${packageJson.version} | Running on ${osTypeMap[os.type()]}
`;

export const startupBanner = () => {
  console.log(gradient.atlas(banner));
};
