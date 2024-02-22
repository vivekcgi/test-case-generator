export const config = {
  port: process.env.PORT,
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  environment: {
    node: process.env.ENVIRONMENT ?? 'development',
  },
  ibm: {
    watsonx: {
      projectId: process.env.WSX_PROJECT_ID,
      modelId: process.env.WSX_MODEL_ID,
      modelApi: process.env.WSX_MODEL_API
    },
    iam: {
      tokenUrl: process.env.IAM_TOKEN_URL,
      apiKey: process.env.IAM_API_KEY
    }
  }
};
