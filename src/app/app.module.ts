import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    GoogleMapsModule,
    NgbModule,
    MarkdownModule.forRoot()
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})

export class AppModule {}
