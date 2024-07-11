import '../utils/dotenv';
export const config = {
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false,
    version: '15',
    pool: {
      min: process.env.DB_POOL_MIN || 2,
      max: process.env.DB_POOL_MAX || 10,
    },
  },
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  environment: {
    node: process.env.ENVIRONMENT ?? 'development',
  },
  ibm: {
    watsonx: {
      projectId: process.env.WSX_PROJECT_ID,
      modelId: String(process.env.WSX_MODEL_ID),
      modelApi: String(process.env.WSX_MODEL_API),
    },
    iam: {
      tokenUrl: process.env.IAM_TOKEN_URL,
      apiKey: String(process.env.IAM_API_KEY),
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};
