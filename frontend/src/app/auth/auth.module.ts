import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { LoginComponent } from 'src/app/auth/components/login/login.component'

@NgModule({
    declarations: [LoginComponent],
    imports: [CommonModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
    exports: [LoginComponent],
})
export class AuthModule {}
