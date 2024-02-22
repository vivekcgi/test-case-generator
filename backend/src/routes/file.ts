import { ServerRoute } from '@hapi/hapi';
import path from 'path';
import { FilesController } from '../controllers/files.controller';

const filesController = new FilesController();

export const upload: ServerRoute = {
    method: 'POST',
    path: '/api/file/upload',
    options: {
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: {
                output: 'stream'
            },
            maxBytes: 10 * 1024 * 1024, // 10MB limit
            uploads: path.join(__dirname, 'uploads')
        }
    },
    handler: async (request, h) => {
        const response = await filesController.upload(request.payload as any);
        return h.response(response.data).code(response.code);
    }
};