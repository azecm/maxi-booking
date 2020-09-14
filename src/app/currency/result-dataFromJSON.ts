import {CurrencyItem, FuncCurrency} from "./currency-item";

export const dataFromJSON: FuncCurrency = function(text: string, currencyView: string[]) {

    let obj:ResultData|undefined
    try{
        obj = JSON.parse(text);
    }
    catch (e){}

    const result = [] as CurrencyItem[];
    if(obj) {
        for (const item of Object.values(obj.Valute)) {
            if (!currencyView.includes(item.CharCode)) continue;
            result.push({
                name: item.Name,
                numCode: item.NumCode,
                charCode: item.CharCode,
                nominal: item.Nominal,
                value: item.Value
            });
        }
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