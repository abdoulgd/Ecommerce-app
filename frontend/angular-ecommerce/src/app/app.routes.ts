import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { authGuardFn } from '@auth0/auth0-angular';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

export const routes: Routes = [
    {path: 'order-history', component: OrderHistoryComponent, canActivate: [authGuardFn]},
    {path: 'members', component: MembersPageComponent,  canActivate: [authGuardFn] },
  
    //{ path: 'login/callback', component: AuthComponent },
    //{ path: 'login', component: LoginComponent },

    { path: 'checkout', component: CheckoutComponent },
    { path: 'cart-details', component: CartDetailsComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: 'search/:keyword', component: ProductListComponent },
    { path: 'category/:id/:name', component: ProductListComponent },
    { path: 'category', component: ProductListComponent },
    { path: 'products', component: ProductListComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products', pathMatch: 'full' }
];
