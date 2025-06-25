import { readFileSync } from 'node:fs';

export function readJSON(path: string): unknown {
    try {
        const data = readFileSync(path);
        return JSON.parse(data.toString());
    } catch {
        //
    }

    return false;
}
