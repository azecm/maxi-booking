import {CurrencyItem, FuncCurrency} from "./currency-item";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {dataFromJSON} from "./result-dataFromJSON";
import {dataFromXML} from "./result-dataFromXML";

@Injectable({
    providedIn: 'root',
})
export class CurrencyUpdateService {
    private currencyView = ['EUR', 'USD'];

    private source: [string, FuncCurrency][] = [
        ['https://www.cbr-xml-daily.ru/daily_json.js', dataFromJSON],
        ['https://www.cbr-xml-daily.ru/daily_utf8.xml', dataFromXML]
    ];

    result = new Subject<CurrencyItem[]>();
    time = new Subject<Date>();
    private enabled = true;

    constructor() {
        this.loaded = this.loaded.bind(this);
        this.error = this.error.bind(this);
    }

    next() {
        if (this.enabled) {
            this.enabled = false;
            this.load();
        }
    }

    private load() {
        const url = this.source[0][0];
        fetch(url)
            .then(res => res.text())
            .then(this.loaded).catch(this.error);
    }

    private error() {
        this.source.push(this.source.splice(0, 1)[0]);
        this.load();
    }

    private loaded(data: string) {
        this.enabled = true;
        this.time.next(new Date());
        this.result.next(
            this.source[0][1](data, this.currencyView)
        );
    }
}

