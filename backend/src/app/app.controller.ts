import { Controller, Get, Redirect, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AppService } from 'app/app.service'

@ApiTags('qrcols')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('hello')
    @UseGuards(AuthGuard('oidc'))
    @ApiResponse({ status: 200, description: 'hello world' })
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('health')
    @ApiResponse({ status: 200, description: 'server status' })
    getHealth() {
        return this.appService.getHealth()
    }

    @Get('lequipe')
    @ApiResponse({ status: 302, description: 'redirect' })
    @Redirect('', 302)
    getLequipe() {
        const url = this.appService.getLequipe()
        return { url }
    }
}
