import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { MarkdownModule } from 'ngx-markdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from '../services/help.service';
import { AppComponent } from './app.component';
import { HelpModalComponent } from './components/help-modal/help-modal.component';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    GoogleMapsModule,
    NgbModule,
    MarkdownModule.forRoot()
  ],
  declarations: [AppComponent, HelpModalComponent],
  bootstrap: [AppComponent],
  providers: [HelpService]
})

export class AppModule {}
