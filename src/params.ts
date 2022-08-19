// @ts-ignore
import urlSearchParams from 'core-js/features/url-search-params'

export class HttpParams {
    private _value: URLSearchParams = new urlSearchParams()

    constructor(headers?: {
        [name: string]: string
    }){
        if (typeof headers === 'object'){
            for (let k in headers){
                this._value.set(k, headers[k])
            }
        }

        this._value.toString()
    }

    public has(name: string): boolean{
        return this._value.has(name)
    }

    public set(name: string, value: string): HttpParams{
        this._value.set(name, value)
        return this
    }

    public get(name: string): string | undefined | null{
        return this._value.get(name)
    }

    public delete(name: string): HttpParams{
        this._value.delete(name)
        return this
    }

    public merge(data: URLSearchParams): HttpParams{
        data.forEach((value, key) => {
            this._value.set(key, value)
        })
        return this
    }

    public toString(): string{
        return this._value.toString()
    }
}
