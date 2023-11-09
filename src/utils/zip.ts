import path from 'node:path';
import {mkdir, unlink} from 'node:fs/promises';
import {zip} from 'zip-a-folder';
import filenamify from 'filenamify';
import {cwd, getPackageConfig} from '.';

export async function addBuildFolderToZip(): Promise<void> {
  const pkg = getPackageConfig();
  const sourceDirectory = path.join(path.resolve(cwd), 'public');
  const destinationDirectory = path.join(path.resolve(cwd), 'zips');
  const destinationFile = path.join(
    destinationDirectory,
    filenamify(`${pkg.name}-v${pkg.version}.zip`, {replacement: '-'}),
  );

  // Does the folder exist?
  try {
    await mkdir(destinationDirectory);
  } catch {}

  // Remove previous zip file
  try {
    await unlink(destinationFile);
  } catch {}

  await zip(sourceDirectory, destinationFile);
}
