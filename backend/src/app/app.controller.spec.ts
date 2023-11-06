import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from 'app/app.controller'
import { AppService } from 'app/app.service'

describe('AppController', () => {
    let appController: AppController

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile()

        appController = app.get<AppController>(AppController)
    })

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!')
        })

        it('should return the server status', () => {
            expect(appController.getHealth()).toEqual({ status: 'OK' })
        })

        it('should return the lequipe url', () => {
            expect(appController.getLequipe()).toEqual({ url: 'https://www.lequipe.fr' })
        })
    })
})
