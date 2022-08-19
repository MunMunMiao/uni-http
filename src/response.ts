import { HttpHeaders } from './headers'

export class HttpResponse<T = any> {
    public readonly data: T | null
    public readonly statusCode: number
    public readonly header: HttpHeaders
    public readonly ok: boolean

    constructor(init: {
        statusCode: number,
        data?: T | null
        header?: {[key: string]: string}
    }) {
        this.data = init.data || null
        this.statusCode = init.statusCode
        this.header = new HttpHeaders(init.header)
        this.ok = this.statusCode >= 200 && this.statusCode < 300;
    }
}
