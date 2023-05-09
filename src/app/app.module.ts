import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Router} from "@angular/router";
import * as Sentry from "@sentry/angular-ivy";
import {AppComponent} from './app.component';
import {VoteComponent} from './vote/vote.component';
import {HeaderComponent} from './header/header.component';
import {SubmissionCardComponent} from './submission-card/submission-card.component';
import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {TodayComponent} from './today/today.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SafePipe} from './safe.pipe';
import {SubmitComponent} from './submit/submit.component';
import {UuidInterceptor} from "./uuid.interceptor";
import {HistoryComponent} from './history/history.component';
import {ReviewComponent} from './review/review.component';
import { StatisticComponent } from './statistic/statistic.component';
import {LazyLoadImageModule} from "ng-lazyload-image";
import { FixMenuComponent } from './fix-menu/fix-menu.component';
import { EditorComponent } from './editor/editor.component';

const routes: Routes = [
  {path: '', component: TodayComponent,},
  {path: 'today', component: TodayComponent},
  {path: 'submit', component: SubmitComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'review', component: ReviewComponent},
  {path: 'statistic', component: StatisticComponent},
  {path: 'editor', component: EditorComponent},
  {path: '**', component: TodayComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    VoteComponent,
    HeaderComponent,
    SubmissionCardComponent,
    TodayComponent,
    SafePipe,
    SubmitComponent,
    HistoryComponent,
    ReviewComponent,
    StatisticComponent,
    FixMenuComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    [RouterModule.forRoot(routes)],
    HttpClientModule,
    FormsModule,
    LazyLoadImageModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
      },
      deps: [Sentry.TraceService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: UuidInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
