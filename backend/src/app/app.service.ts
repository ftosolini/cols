import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!'
    }

    getHealth(): { status: string } {
        return { status: 'OK' }
    }

    getLequipe(): string {
        return 'https://www.lequipe.fr'
    }
}
