import path from "path";
import * as fs from 'fs';

export const readContent = async (filename: string) => {
    return new Promise<string>(async function(resolve, reject) {
        await fs.readFile(path.join(__dirname, '..', 'controllers', 'uploads', filename), 'utf8', (error, data) => {
            if (error) {
                reject(new Error('Something went wrong while reading file'));
            }
            resolve(data);
        })           
    });
}

