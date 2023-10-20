import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';
import { MultiRange } from 'multi-integer-range';
/// <reference types="multi-integer-range">

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public title = "";

  constructor() {
    console.log('Environment config', Config);
  }
}