import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLogged = true
  constructor() {}

  isLogged():boolean {
    return this._isLogged
  }
  login(_username: string, _password: string): void {
    this._isLogged = true
  }

  logout(): void {
    this._isLogged = false
  }
}
