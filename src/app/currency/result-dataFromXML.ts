import {CurrencyItem, FuncCurrency} from "./currency-item";

export const dataFromXML: FuncCurrency = function(text: string, currencyView: string[]) {
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const result = [] as CurrencyItem[];
    for (const item of Array.from(doc.documentElement.getElementsByTagName('Valute'))) {
        const numCode = item.querySelector('NumCode')?.textContent;
        const charCode = item.querySelector('CharCode')?.textContent;
        const nominalStr = item.querySelector('Nominal')?.textContent;
        const name = item.querySelector('Name')?.textContent;
        const valueStr = item.querySelector('Value')?.textContent;
        if (!numCode || !charCode || !nominalStr || !name || !valueStr) continue;
        if (!currencyView.includes(charCode)) continue;

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