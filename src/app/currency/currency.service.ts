import {Injectable} from "@angular/core";
import {interval, Subscription} from "rxjs";

import {CurrencyUpdateService} from "./currency-update.service";

@Injectable({
    providedIn: 'root',
})
export class CurrencyService{
    private updateIntervalSec = 10;
    private subscriptionInterval!: Subscription;

    constructor(public updater: CurrencyUpdateService) {
        this.init();
    }

    private init(){
        this.timer();
        const observable = interval(this.updateIntervalSec * 1000);
        this.subscriptionInterval = observable.subscribe(this.timer.bind(this));
    }

    private timer(){
        this.updater.next();
    }

    stop() {
        this.subscriptionInterval.unsubscribe();
    }
}
