import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from 'auth/auth.service'
import { Client, Issuer, Strategy, TokenSet, UserinfoResponse } from 'openid-client'

export type SessionUser = {
    idToken?: string
    accessToken?: string
    refreshToken?: string
    userInfo: UserinfoResponse
}
export const buildOpenIdClient = async (configService: ConfigService) => {
    const issuer = await Issuer.discover(`${configService.get<string>('keycloak.issuer')}`)
    const client = new issuer.Client({
        client_id: configService.get<string>('keycloak.clientId') || '',
        client_secret: configService.get<string>('keycloak.clientSecret'),
        redirect_uris: ['http://localhost:3000/auth/callback'],
        response_types: ['code'],
    })
    return { client, issuer }
}

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
    private client: Client
    private issuer: Issuer<Client>
    constructor(
        private readonly authService: AuthService,
        client: Client,
        issuer: Issuer<Client>
    ) {
        super({
            client,
            params: {
                redirect_uri: 'http://localhost:3000/auth/callback',
                scope: 'openid profile email',
            },
            passReqToCallback: false,
            usePKCE: false,
        })
        this.issuer = issuer
        this.client = client
    }

    async validate(tokenSet: TokenSet): Promise<SessionUser> {
        const userInfo: UserinfoResponse = await this.client.userinfo(tokenSet)

        try {
            const idToken = tokenSet.id_token
            const accessToken = tokenSet.access_token
            const refreshToken = tokenSet.refresh_token
            const user: SessionUser = {
                idToken,
                accessToken,
                refreshToken,
                userInfo,
            }
            return user
        } catch (err) {
            throw new UnauthorizedException()
        }
    }
}
