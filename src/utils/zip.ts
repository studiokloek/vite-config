import path from 'node:path';
import {zip} from 'zip-a-folder';
import filenamify from 'filenamify';
import {cwd, getPackageConfig} from '.';

export async function addBuildFolderToZip(): Promise<void> {
  const pkg = getPackageConfig();

  const source = path.join(path.resolve(cwd), 'public');
  const destination = path.join(
    path.resolve(cwd),
    'zips',
    filenamify(`${pkg.name}-${pkg.version}.zip`, {replacement: '-'}),
  );

  await zip(source, destination);
}
