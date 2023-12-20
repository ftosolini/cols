import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from 'src/app/auth/components/login/login.component'
import { privateGuard } from 'src/app/core/private.guard'
import { publicGuard } from 'src/app/core/public.guard'
import { ListFeaturesComponent } from 'src/app/map/components/list-features/list-features.component'
import { MapComponent } from 'src/app/map/components/map/map.component'
import { LayoutComponent } from 'src/app/shared/components/layout/layout.component'

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [publicGuard],
    },
    {
        path: 'map',
        component: MapComponent,
        canActivate: [privateGuard],
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'items',
                component: ListFeaturesComponent,
                canActivate: [privateGuard],
            },
        ],
    },
    {
        path: 'profile',
        component: LayoutComponent,
        canActivate: [privateGuard],
    },
    {
        path: 'settings',
        component: LayoutComponent,
        canActivate: [privateGuard],
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '**',
        redirectTo: 'login',
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
