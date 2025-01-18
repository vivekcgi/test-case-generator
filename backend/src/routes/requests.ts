import { ResponseToolkit, ServerRoute, Request } from '@hapi/hapi';
import Joi from 'joi';
import { Request as RequestModel } from '../models';
import { getDocumentType } from '../utils/common';
import { scheduler } from '../pipelines/lib/scheduler';

export const add: ServerRoute = {
  path: '/api/requests',
  method: 'POST',
  options: {
    validate: {
      payload: Joi.object({
        fileKey: Joi.string().required(),
        tag: Joi.string().required(),
      }),
    },
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    const payload: { fileKey: string; tag: string } = request.payload as any;
    try {
      const docType = await getDocumentType(payload.fileKey);

      const newRequest = await RequestModel.query().insert({
        tag: payload.tag,
        fileKey: payload.fileKey,
        docType: docType,
      });

      scheduler.add({
        name: 'documentation',
        data: {
          requestId: newRequest.id,
          filename: newRequest.fileKey,
          type: newRequest.docType,
        },
      });

      return h
        .response({ success: true, message: 'Request created', data: { requestId: newRequest.id } })
        .code(201);
    } catch (e: any) {
      return h
        .response({
          success: false,
          message: 'Something went wrong',
        })
        .code(500);
    }
  },
};

export const list: ServerRoute = {
  path: '/api/requests',
  method: 'GET',
  options: {
    validate: {
      query: Joi.object({
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
      }),
    },
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    const query: { page: number; limit: number } = request.query as any;
    try {
      const allRequests = await RequestModel.query()
        .select()
        .withGraphFetched('fragments')
        .withGraphFetched('fragments.result')
        .withGraphFetched('fragments.error')
        .page(query.page - 1, query.limit);

      return h
        .response({ success: true, message: 'Requests fetched', data: allRequests })
        .code(200);
    } catch (e: any) {
      return h
        .response({
          success: false,
          message: 'Something went wrong',
        })
        .code(500);
    }
  },
};

export const getOne: ServerRoute = {
  path: '/api/requests/{id}',
  method: 'GET',
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().required(),
      }),
    },
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    const params: { id: string } = request.params as any;
    try {
      const oneRequests = await RequestModel.query()
        .select()
        .where('id', params.id)
        .withGraphFetched('fragments')
        .withGraphFetched('fragments.result')
        .withGraphFetched('fragments.error');
      // .modifiers({
      //   selectLatest(builder) {
      //     builder.orderBy('created_at', 'DESC').first();
      //   },
      // });

      return h.response({ success: true, message: 'Request fetched', data: oneRequests }).code(200);
    } catch (e: any) {
      return h
        .response({
          success: false,
          message: 'Something went wrong',
        })
        .code(500);
    }
  },
};

export const retry: ServerRoute = {
  path: '/api/requests/{id}/rerun',
  method: 'POST',
  options: {
    validate: {
      params: Joi.object({
        id: Joi.string().required(),
      }),
    },
  },
  handler: async (request: Request, h: ResponseToolkit) => {
    const params: { id: string } = request.params as any;
    try {
      const oneRequest = await RequestModel.query().select().where('id', params.id).first();
      scheduler.add({
        name: 'generation',
        data: {
          requestId: oneRequest?.id,
          filename: oneRequest?.fileKey,
          type: oneRequest?.docType,
        },
      });
      return h
        .response({
          success: true,
          message: 'Request submitted for re-run',
          data: { requestId: oneRequest?.id },
        })
        .code(200);
    } catch (e: any) {
      return h
        .response({
          success: false,
          message: 'Something went wrong',
        })
        .code(500);
    }
  },
};
