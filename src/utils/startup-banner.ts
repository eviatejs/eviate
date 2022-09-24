import os from 'os';

import pc from 'picocolors';

import packageJson from '../../package.json';

const osTypeMap: Record<string, any> = {
  Darwin: 'macOS',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const banner =
  pc.cyan(`
   ____     _      __
  / __/  __(_)__ _/ /____
 / _/| |/ / / _ / __/ -_)
/___/|___/_/\_,_/\__/\__/

`) +
  pc.yellow(
    pc.bold(`v${packageJson.version} | Running on ${osTypeMap[os.type()]}`)
  );

export const startupBanner = () => {
  console.log(banner);
};
