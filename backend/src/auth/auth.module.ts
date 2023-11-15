import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from 'auth/auth.controller'
import { AuthService } from 'auth/auth.service'
import { buildOpenIdClient, OidcStrategy } from 'auth/oidc.strategy'
import { SessionSerializer } from 'auth/session.serializer'
import { ConfigModule } from 'config/config.module'

const OidcStrategyFactory = {
    provide: 'OidcStrategy',
    useFactory: async (authService: AuthService, configService: ConfigService) => {
        // build the dynamic client before injecting it into the strategy for use in the constructor super call.
        const { client, issuer } = await buildOpenIdClient(configService)
        const strategy = new OidcStrategy(authService, client, issuer)
        return strategy
    },
    inject: [AuthService, ConfigService],
}

@Module({
    providers: [AuthService, OidcStrategyFactory, SessionSerializer],
    controllers: [AuthController],
    exports: [AuthService],
    imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'oidc' })],
})
export class AuthModule {}
