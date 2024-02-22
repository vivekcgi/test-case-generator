import {  randomUUID} from 'crypto'
import { ResponseHelper } from '../utils/response-helper';
import path from 'path';
import fs from 'fs';

export class FilesController {

    async upload(payload: any){
        if (payload.file) {
            const file = payload.file;
            const filename = payload.filename;
            const filepath = path.join(__dirname, 'uploads', filename);
            
            const fileStream = fs.createWriteStream(filepath);
            fileStream.on('error', (err) => console.error(err));

            await file.pipe(fileStream);

            return ResponseHelper.success('File uploaded successfully', {
                filename
            });
        } else {
            return ResponseHelper.error('Bad request', null, 400);
        }
    }

    async read(filename: string) {}
}