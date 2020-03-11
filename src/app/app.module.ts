import { BartendersComponent } from './web/bartenders/bartenders.component';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { DirectionsMapDirective } from './shared/directive/sebm-google-map-directions';
import { AuthGuard } from './auth.guard';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SocialLoginModule, AuthServiceConfig } from 'angular4-social-login';
import { FacebookLoginProvider } from 'angular4-social-login';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';

import { AppComponent } from './app.component';
import { FrontendComponent } from './web/frontend.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BackendComponent } from './admin/backend.component';
import { AccountinfoComponent } from './web/accountinfo/accountinfo.component';
import { CartComponent } from './web/cart/cart.component';
import { HelpComponent } from './web/help/help.component';
import { LoginComponent } from './web/login/login.component';
import { LoginFromCheckoutComponent } from './web/login-from-checkout/login-from-checkout.component';
import { LiquorStoreForm } from './web/liquorstoreform/liquorstoreform.component';
import { MyordersComponent } from './web/myorders/myorders.component';
import { PrimarydeliveryComponent } from './web/primarydelivery/primarydelivery.component';
import { ProductdetailComponent } from './web/productdetail/productdetail.component';
import { ProductlistingComponent } from './web/productlisting/productlisting.component';
import { ProfileComponent } from './web/profile/profile.component';
import { ViewreceiptComponent } from './web/viewreceipt/viewreceipt.component';
import { ProviderServiceService } from '../app/shared/services/provider-service.service';
import { DaysLeftPipe } from './shared/pipes/days-left.pipe';
import { UserService } from './shared/services/user.service';
import { CalculateCartPricePipe } from './shared/pipes/calculate-cart-price.pipe';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { CalculateSavedPricePipe } from './shared/pipes/calculate-saved-price.pipe';
import { CalculatePointsEarnedPipe } from './shared/pipes/calculate-points-earned.pipe';
import { CalculateSubtotalPipe } from './shared/pipes/calculate-subtotal.pipe';
import { IndexComponent } from './web/index/index.component';
import { ForgotpasswordComponent } from './web/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './web/reset-password/reset-password.component';
import { CalculateTotalPricePipe } from './shared/pipes/calculate-total-price.pipe';
import { CallbackPipe } from './shared/pipes/callback.pipe';
import { AddPaymentCardComponent } from './web/add-payment-card/add-payment-card.component';
import { CardImagePipe } from './shared/pipes/card-image.pipe';
import { FACEBOOK_APP_ID, GOOGLE_API_KEY } from './constants/constants';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { MomentModule } from 'angular2-moment';
import { MomentTimezoneModule } from 'angular-moment-timezone';
import { CalculateTaxPipe } from './shared/pipes/calculate-tax.pipe';
import { TotalCartItemsPipe } from './shared/pipes/total-cart-items.pipe';
import { PointsBarPipe } from './shared/pipes/points-bar.pipe';
import { ReviewProductComponent } from './web/review-product/review-product.component';
import { NgXCreditCardsModule } from 'ngx-credit-cards';
import { DatetimepickerComponent } from './web/datetimepicker.component';
import { StarRatingModule } from 'angular-star-rating';
import { OwlModule } from 'ngx-owl-carousel';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { SpinnerModule } from '@chevtek/angular-spinners';
import { ClipboardDirective } from './shared/directive/clipboard.directive';
import { ClipboardService } from './shared/services/clipboard.service';
import { NgxMaskModule } from 'ngx-mask';
import { OrderModule } from 'ngx-order-pipe';

import * as Payment from 'payment';
import { ClickStopPropagationDirective } from './shared/directive/click-stop-propagation.directive';
import { PrivacyPolicyComponent } from './web/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './web/terms-of-service/terms-of-service.component';
import { ProductImageUrlPipe } from './shared/pipes/product-image-url.pipe';
import { CartDeliveryComponent } from './web/cart-delivery/cart-delivery.component';
import { CartPlaceorderComponent } from './web/cart-placeorder/cart-placeorder.component';
import { CheckoutSummaryComponent } from './web/checkout-summary/checkout-summary.component';
import { CalculateOrderTotalPipe } from './shared/pipes/calculate-order-total.pipe';
import { KeysPipe } from './shared/pipes/keys.pipe';
import { DynamicScriptLoaderService } from './shared/services/DynamicScriptLoader';
import { Angulartics2Facebook } from 'angulartics2/facebook';
Payment.fns.restrictNumeric = Payment.restrictNumeric;
Payment.fns.formatCardExpiry = Payment.formatCardExpiry;
Payment.fns.formatCardCVC = Payment.formatCardCVC;

const config = new AuthServiceConfig([
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(FACEBOOK_APP_ID)
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        FrontendComponent,
        PageNotFoundComponent,
        BackendComponent,
        AccountinfoComponent,
        CartComponent,
        HelpComponent,
        LoginComponent,
        LoginFromCheckoutComponent,
        MyordersComponent,
        PrimarydeliveryComponent,
        ProductdetailComponent,
        ProductlistingComponent,
        ProfileComponent,
        ViewreceiptComponent,
        DaysLeftPipe,
        CalculateCartPricePipe,
        CalculateSavedPricePipe,
        CalculatePointsEarnedPipe,
        CalculateSubtotalPipe,
        IndexComponent,
        ForgotpasswordComponent,
        ResetPasswordComponent,
        CalculateTotalPricePipe,
        CallbackPipe,
        AddPaymentCardComponent,
        CardImagePipe,
        CartPlaceorderComponent,
        CalculateTaxPipe,
        TotalCartItemsPipe,
        PointsBarPipe,
        ReviewProductComponent,
        DatetimepickerComponent,
        ClickStopPropagationDirective,
        PrivacyPolicyComponent,
        TermsOfServiceComponent,
        ClipboardDirective,
        DirectionsMapDirective,
        ProductImageUrlPipe,
        CartDeliveryComponent,
        CartPlaceorderComponent,
        CheckoutSummaryComponent,
        CalculateOrderTotalPipe,
        LiquorStoreForm,
        KeysPipe,
        BartendersComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        OrderModule,
        HttpClientModule,
        ReactiveFormsModule,
        SocialLoginModule,
        HttpModule,
        FlashMessagesModule,
        IonRangeSliderModule,
        NgXCreditCardsModule,
        AgmCoreModule.forRoot({
            apiKey: GOOGLE_API_KEY,
            libraries: ['places']
        }),
        MomentModule,
        MomentTimezoneModule,
        StarRatingModule.forRoot(),
        OwlModule,
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics, Angulartics2Facebook]),
        SpinnerModule,
        NgxMaskModule,
    ],
    providers: [
        ProviderServiceService,
        UserService,
        AuthGuard,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        GoogleMapsAPIWrapper,
        ClipboardService,
        DynamicScriptLoaderService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
