import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginGuard } from 'auth/auth.guard'
import { SessionUser } from 'auth/oidc.strategy'
import { Request, Response } from 'express'
import { Issuer } from 'openid-client'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    @UseGuards(LoginGuard)
    @Get('/login')
    login() {
        console.log('login')
    }

    @Get('/me')
    user(@Req() req: Request) {
        return req.user
    }

    @UseGuards(LoginGuard)
    @Get('/callback')
    loginCallback(@Req() req: Request, @Res() res: Response) {
        console.log(req.user)
        const { accessToken, refreshToken } = req.user as SessionUser
        res.cookie('accessToken', accessToken)
        res.cookie('refreshToken', refreshToken)
        return res.redirect('http://localhost:4200')
    }

    @Get('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const user = req.user as SessionUser
        const idToken = user ? user.idToken : undefined
        req.logout(() => {
            console.log('logout')
        })
        req.session.destroy(async (_error: unknown) => {
            const TrustIssuer = await Issuer.discover(`http://localhost:8080/realms/qrcols`)
            const end_session_endpoint = TrustIssuer.metadata.end_session_endpoint
            if (end_session_endpoint) {
                res.redirect(
                    end_session_endpoint +
                        '?post_logout_redirect_uri=' +
                        'http://localhost:4200' +
                        (idToken ? '&id_token_hint=' + idToken : '')
                )
            } else {
                res.redirect('/')
            }
        })
    }
}
