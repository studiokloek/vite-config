import crypto, {type BinaryLike} from 'node:crypto';

export function md5(buffer: BinaryLike): string {
  return crypto.createHash('md5').update(buffer).digest('hex');
}
