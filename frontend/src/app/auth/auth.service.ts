import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _isLogged = true

    isLogged(): boolean {
        return this._isLogged
    }
    login(username: string, password: string): void {
        console.log(username, password)
        this._isLogged = true
    }

    logout(): void {
        this._isLogged = false
    }
}
