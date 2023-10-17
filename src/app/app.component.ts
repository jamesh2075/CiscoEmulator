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

  public title: string = "";

  constructor() {
    console.log('Environment config', Config);
  }

  ngOnInit() {
    // let value:string = "[4-8],3";

    // value = value.split('[').join('').split(']').join('');
    // let multiRange = new MultiRange(value);
    // let values: number[] = multiRange.toArray();
    // values = values.sort(function (a, b) {
    //     return a - b
    // });
    // this.title = values.toString();
    this.title = "Cisco Emulator";
  }

  
}