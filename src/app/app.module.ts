import { NgOptimizedImage } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule, RouterOutlet, Routes } from '@angular/router'
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { MarkdownModule } from 'ngx-markdown'
import { AppComponent } from './app.component'
import { AuthGuard } from './auth.guard'

import { EndComponent } from './public/end/end.component'
import { FixMenuComponent } from './public/fix-menu/fix-menu.component'
import { GoodbyeComponent } from './public/goodbye/goodbye.component'
import { HeaderComponent } from './public/header/header.component'
import { ReviewComponent } from './review/review.component'
import { SafePipe } from './safe.pipe'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxMasonryModule } from 'ngx-masonry'
import { ConfigComponent } from './config/config.component'
import { LazyLoadDirective } from './lazy-load.directive'
import { RoundPipe } from './round.pipe'
import { StatisticComponent } from './statistic/statistic.component'
import { CardComponent } from './submission/component/card/card.component'
import { FeedbackComponent } from './submission/component/feedback/feedback.component'
import { MediaComponent } from './submission/component/media/media.component'
import { TopComponent } from './submission/component/top/top.component'
import { EndlessComponent } from './submission/endless/endless.component'
import { SubmitComponent } from './submission/submit/submit.component'
import { TruncatePipe } from './truncate.pipe'
import { UUIDInterceptor } from './uuid.interceptor'

const routes: Routes = [
  { path: '', component: GoodbyeComponent },
  { path: 'endless', component: EndlessComponent },
  { path: 'submit', component: SubmitComponent },
  { path: 'review', component: ReviewComponent },
  {
    path: 'statistic',
    component: StatisticComponent,
    canActivate: [AuthGuard],
  },
  { path: 'config', component: ConfigComponent },
  { path: '**', component: GoodbyeComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
    GoodbyeComponent,
    HeaderComponent,
    CardComponent,
    SafePipe,
    SubmitComponent,
    ReviewComponent,
    StatisticComponent,
    FixMenuComponent,
    EndlessComponent,
    TopComponent,
    EndComponent,
    TruncatePipe,
    LazyLoadDirective,
  ],
  imports: [
    BrowserAnimationsModule,
    NgxMasonryModule,
    BrowserModule,
    RouterOutlet,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,
    LazyLoadImageModule,
    InfiniteScrollModule,
    NgOptimizedImage,
    MarkdownModule.forRoot(),
    MediaComponent,
    RoundPipe,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UUIDInterceptor,
      multi: true,
    },
  ],
  exports: [CardComponent, TruncatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
