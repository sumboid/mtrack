import { customAlphabet } from 'nanoid';

const abc = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const nanoid = customAlphabet(abc, 10);

export const makeIDGen = (prefix: string) => (): string => {
  const id = nanoid();
  return `${prefix}-${id.slice(0, 5)}-${id.slice(5)}`;
};

