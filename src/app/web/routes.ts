import { BartendersComponent } from './bartenders/bartenders.component';
import { CheckoutSummaryComponent } from './checkout-summary/checkout-summary.component';
import { CartPlaceorderComponent } from './cart-placeorder/cart-placeorder.component';
import { AddPaymentCardComponent } from './add-payment-card/add-payment-card.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ViewreceiptComponent } from './viewreceipt/viewreceipt.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductlistingComponent } from './productlisting/productlisting.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { PrimarydeliveryComponent } from './primarydelivery/primarydelivery.component';
import { MyordersComponent } from './myorders/myorders.component';
import { HelpComponent } from './help/help.component';
import { CartDeliveryComponent } from './cart-delivery/cart-delivery.component';
import { AccountinfoComponent } from './accountinfo/accountinfo.component';
import { LoginComponent } from './login/login.component';
import { Routes, CanActivate } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './../auth.guard';
import { IndexComponent } from './index/index.component';
import { ReviewProductComponent } from './review-product/review-product.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { LiquorStoreForm } from './liquorstoreform/liquorstoreform.component';
import { LoginFromCheckoutComponent } from './login-from-checkout/login-from-checkout.component';

export const FRONTEND_ROUTES: Routes = [
    {
        path: '',
        component: IndexComponent
    },
    {
        path: 'forgotpassword',
        component: ForgotpasswordComponent
    },
    {
        path: 'reset-password/:accessToken/:accountId',
        component: ResetPasswordComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logincheckout',
        component: LoginFromCheckoutComponent
    },
    {
        path: 'accountinfo',
        canActivate: [AuthGuard],
        component: AccountinfoComponent
    },
    {
        path: 'cart',
        // canActivate: [AuthGuard],
        component: CartComponent
    },
    {
        path: 'checkout-summary/:orderId',
        canActivate: [AuthGuard],
        component: CheckoutSummaryComponent
    },
    {
        path: 'checkout-summary',
        canActivate: [AuthGuard],
        component: CheckoutSummaryComponent
    },
    {
        path: 'cart-delivery',
        // canActivate: [AuthGuard],
        component: CartDeliveryComponent
    },
    {
        path: 'cart-placeorder',
        canActivate: [AuthGuard],
        component: CartPlaceorderComponent
    },
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'myorders',
        canActivate: [AuthGuard],
        component: MyordersComponent
    },
    {
        path: 'add-payment',
        canActivate: [AuthGuard],
        component: AddPaymentCardComponent
    },
    {
        path: 'primarydelivery',
        canActivate: [AuthGuard],
        component: PrimarydeliveryComponent
    },
    {
        path: 'productdetail/:offerId/:cat',
        // canActivate: [AuthGuard],
        component: ProductdetailComponent
    },
    {
        path: 'productlisting',
        // canActivate: [AuthGuard],
        component: ProductlistingComponent
    },
    {
        path: 'productlisting/:productCategory',
        // canActivate: [AuthGuard],
        component: ProductlistingComponent
    },
    {
        path: 'profile',
        canActivate: [AuthGuard],
        component: ProfileComponent
    },
    {
        path: 'view-receipt/:orderId',
        canActivate: [AuthGuard],
        component: ViewreceiptComponent
    },
    {
        path: 'review-product/:orderId',
        canActivate: [AuthGuard],
        component: ReviewProductComponent
    },
    {
        path: 'privacyPolicy',
        component: PrivacyPolicyComponent
    },
    {
        path: 'termsOfUse',
        component: TermsOfServiceComponent
    },
    {
        path: 'liquorstoreform',
        component: LiquorStoreForm
    },
    {
        path: 'book-a-bartender',
        component: BartendersComponent
    }
];
