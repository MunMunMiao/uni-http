export class HttpHeaders {
    private _value = new Map<string, string>()

    constructor(headers?: {
        [name: string]: string
    }){
        if (typeof headers === 'object'){
            for (let k in headers){
                this._value.set(k, headers[k])
            }
        }
    }

    public has(name: string): boolean{
        return this._value.has(name)
    }

    public set(name: string, value: string): HttpHeaders{
        this._value.set(name, value)
        return this
    }

    public get(name: string): string | undefined | null{
        return this._value.get(name)
    }

    public delete(name: string): boolean{
        return this._value.delete(name)
    }

    public toObject(): {[key: string]: string}{
        return Object.fromEntries(this._value)
    }
}
