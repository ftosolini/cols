import { PassportSerializer } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { SessionUser } from 'auth/oidc.strategy'
@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: SessionUser, done: (err: Error | null, user: SessionUser) => void) {
        done(null, user)
    }
    deserializeUser(payload: string, done: (err: Error | null, payload: string) => void) {
        done(null, payload)
    }
}
