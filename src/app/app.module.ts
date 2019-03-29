import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { EditModule } from './edit/edit.module'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    EditModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
