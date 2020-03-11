import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FrontendComponent } from './web/frontend.component';
import { BackendComponent } from './admin/backend.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FRONTEND_ROUTES } from './web/routes';
import { BACKEND_ROUTES } from './admin/routes';

const ROUTES: Routes = [
    {
        path: '',
        component: FrontendComponent,
        children: FRONTEND_ROUTES
    },
    {
        path: '',
        component: BackendComponent,
        children: BACKEND_ROUTES
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }
