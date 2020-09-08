import {Component, OnDestroy} from '@angular/core';
import {CurrencyService} from "./currency/currency.service";
import {CurrencyItem} from "./currency/currency-item";

@Component({
  selector: 'app-root',
  template: `      
    <div style="text-align:center" class="content">
      <h1>
        Welcome!
      </h1>
      <p>{{currency.updater.time|async|date: 'yyyy/MM/dd HH:mm:ss'}}</p>
      <ol>
        <li *ngFor='let item of currency.updater.result | async; trackBy: trackByFn'>
          {{item.charCode}}: {{item.value}}
        </li>
      </ol>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnDestroy{
  constructor(public currency:CurrencyService) {}
  trackByFn(index: number, item: CurrencyItem){
    return item.charCode;
  }
  ngOnDestroy() {
    this.currency.stop();
  }
}
