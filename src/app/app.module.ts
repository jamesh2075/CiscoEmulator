import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF, NgClass } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { CommandsComponent } from './commands/commands.component';
import { SourcecodeComponent } from './sourcecode/sourcecode.component';
import { NgModuleCompiler } from '@angular/compiler';

@NgModule({
  declarations: [
    AppComponent,
    CommandsComponent,
    SourcecodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AboutModule,
    HomeModule,
    SharedModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

