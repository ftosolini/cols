import * as process from 'process'

export default () => ({
    env: process.env.NODE_ENV,
    server: {
        name: process.env.SERVER_NAME,
        port: process.env.SERVER_PORT,
        version: process.env.SERVER_VERSION,
    },
    logs: {
        filename: process.env.LOGS_FILENAME,
        dirname: process.env.LOGS_DIRNAME,
        datePattern: process.env.LOGS_DATE_PATTERN,
        zippedArchive: process.env.LOGS_ZIPPED_ARCHIVE,
        maxSize: process.env.LOGS_MAX_SIZE,
        maxFiles: process.env.LOGS_MAX_FILES,
    },
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    },
    keycloak: {
        issuer: process.env.KEYCLOAK_ISSUER,
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    },
})
