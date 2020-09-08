import {currencySource, currencyView} from "../config";
import {CurrencyItem} from "./currency-item";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class CurrencyUpdateService {
    private source = [...currencySource];

    result = new Subject<CurrencyItem[]>();
    time = new Subject<Date>();

    constructor() {
        this.loaded = this.loaded.bind(this);
        this.error = this.error.bind(this);
    }

    next() {
        const url = this.source[0];
        const flagJSON = url.endsWith('.js') || url.endsWith('.json');

        fetch(url)
            .then(res => flagJSON ? res.json() : res.text())
            .then(this.loaded).catch(this.error);
    }

    private error() {
        this.source.push(this.source.splice(0, 1)[0]);
        this.next();
    }

    private loaded(data: ResultData | string) {
        if (!data) this.next();

        this.time.next(new Date());
        this.result.next(
            typeof (data) == "string"
                ? dataFromXML(data, currencyView)
                : dataFromJSON(data, currencyView)
        );
    }
}

function dataFromXML(text: string, currencySelector: string[]) {
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = [] as CurrencyItem[];
    for (const item of Array.from(doc.documentElement.getElementsByTagName('Valute'))) {
        const numCode = item.querySelector('NumCode')?.textContent;
        const charCode = item.querySelector('CharCode')?.textContent;
        const nominalStr = item.querySelector('Nominal')?.textContent;
        const name = item.querySelector('Name')?.textContent;
        const valueStr = item.querySelector('Value')?.textContent;
        if (!numCode || !charCode || !nominalStr || !name || !valueStr) continue;
        if (!currencySelector.includes(charCode)) continue;

        result.push({
            name,
            numCode,
            charCode: charCode,
            nominal: +nominalStr,
            value: +valueStr.replace(',', '.')
        });
    }

    return result;
}

function dataFromJSON(obj: ResultData, currencySelector: string[]) {
    const result = [] as CurrencyItem[];
    for(const item of Object.values(obj.Valute)){
        if (!currencySelector.includes(item.CharCode)) continue;
        result.push({
            name: item.Name,
            numCode: item.NumCode,
            charCode: item.CharCode,
            nominal: item.Nominal,
            value: item.Value
        });
    }
    return result;
}


interface ResultItem {
    ID: string//"R01010",
    NumCode: string//"036",
    CharCode: string//"AUD",
    Nominal: number//1,
    Name: string//"Австралийский доллар",
    Value: number//55.3553,
    Previous: number//55.0605
}

interface ResultData {
    Date: string//"2020-09-09T11:30:00+03:00",
    PreviousDate: string//"2020-09-08T11:30:00+03:00",
    PreviousURL: string//"\/\/www.cbr-xml-daily.ru\/archive\/2020\/09\/08\/daily_json.js",
    Timestamp: string//"2020-09-08T18:00:00+03:00",
    Valute: { [s: string]: ResultItem }
}