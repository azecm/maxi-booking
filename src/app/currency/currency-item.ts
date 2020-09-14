

export interface CurrencyItem{
    numCode: string//"036",
    charCode: string//"AUD",
    nominal: number//1,
    name: string//"Австралийский доллар",
    value: number//55.3553,
}

export type FuncCurrency = (text: string, list: string[])=>CurrencyItem[]
