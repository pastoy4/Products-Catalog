import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/public/product-list/product-list.component').then(
                (m) => m.ProductListComponent
            ),
    },
    {
        path: 'product/:id',
        loadComponent: () =>
            import('./features/public/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent
            ),
    },
    {
        path: 'admin/login',
        loadComponent: () =>
            import('./features/admin/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/admin/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'product/new',
                loadComponent: () =>
                    import('./features/admin/product-form/product-form.component').then(
                        (m) => m.ProductFormComponent
                    ),
            },
            {
                path: 'product/edit/:id',
                loadComponent: () =>
                    import('./features/admin/product-form/product-form.component').then(
                        (m) => m.ProductFormComponent
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
