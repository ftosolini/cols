import * as Joi from 'joi'
import process from 'process'

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
    LOGS_FILENAME: Joi.string().default('qrcols-%DATE%.log'),
    LOGS_DIRNAME: Joi.string().default('../logs'),
    LOGS_DATE_PATTERN: Joi.string().default('YYYY-MM-DD'),
    LOGS_ZIPPED_ARCHIVE: Joi.boolean().default(true),
    LOGS_MAX_SIZE: Joi.string().default('20m'),
    LOGS_MAX_FILES: Joi.string().default('14d'),
    SERVER_NAME: Joi.string().required(),
    SERVER_PORT: Joi.number().default(3000),
    SERVER_VERSION: Joi.string().default(process.env.npm_package_version || '0.0.0'),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().default(3306),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().default('qrcols'),
    KEYCLOAK_ISSUER: Joi.string().required(),
    KEYCLOAK_CLIENT_ID: Joi.string().required(),
    KEYCLOAK_CLIENT_SECRET: Joi.string().required(),
    APP_HOME_URL: Joi.string().default('http://www.ftosolini.fr')
})
