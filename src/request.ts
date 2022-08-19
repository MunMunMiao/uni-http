import { HttpHeaders } from './headers'
import { HttpParams } from './params'
// @ts-ignore
import url from 'core-js/features/url'
// @ts-ignore
import urlSearchParams from 'core-js/features/url-search-params'

export type Method = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

export class HttpRequest {
    public method: Method
    public url: string
    public body?: string | object | ArrayBuffer | null
    public host?: string
    public headers?: HttpHeaders
    public params?: HttpParams
    public withCredentials?: boolean
    public responseType?: 'json' | 'text' | 'arraybuffer'
    public withInterceptor?: boolean
    public filePath?: string

    constructor(options: {
        method: Method,
        url: string,
        host?: string,
        body?: string | object | ArrayBuffer | null,
        headers?: HttpHeaders | { [key: string]: string },
        params?: HttpParams | { [key: string]: string },
        withCredentials?: boolean,
        responseType?: 'json' | 'text' | 'arraybuffer'
        withInterceptor?: boolean
        filePath?: string
    }) {
        this.method = options.method
        this.url = options.url
        this.host = options.host
        this.body = options.body
        this.withCredentials = options.withCredentials
        this.responseType = options.responseType
        this.withInterceptor = options.withInterceptor
        this.filePath = options.filePath

        if (options.headers instanceof HttpHeaders){
            this.headers = options.headers
        }else {
            this.headers = new HttpHeaders(options.headers)
        }

        if (options.params instanceof HttpParams){
            this.params = options.params
        }else {
            this.params = new HttpParams(options.params)
        }
    }

    public serializeBody(): string | ArrayBuffer | undefined | null{
        if (this.body instanceof ArrayBuffer){
            return this.body
        }

        if (this.body instanceof Object){
            return JSON.stringify(this.body)
        }

        return this.body
    }

    public detectContentTypeHeader(): string | null{
        if (this.body instanceof ArrayBuffer){
            return 'application/octet-stream'
        }else if (this.body instanceof Object){
            return 'application/json'
        }else if (typeof this.body === 'string' ){
            return 'text/plain'
        }else {
            return null
        }
    }

    public toUniAppRequest(): UniApp.RequestOptions {
        const u: URL = new url(this.url, this.host)

        if (this.params) {
            u.search = this.params.merge(u.searchParams).toString()
        }

        let headers: {
            [key: string]: string
        } = {}

        if (this.headers) {
            headers = this.headers.toObject()
        }

        let body: string | ArrayBuffer | undefined

        if (this.body) {
            const rs = this.serializeBody()
            if (rs) {
                body = rs
            }

            const mime = this.detectContentTypeHeader()

            if (mime){
                headers['Content-type'] = mime
            }
        }

        let dataType: string | undefined
        let responseType: string | undefined

        if (this.responseType){
            switch (this.responseType) {
                case 'json':
                    dataType = 'json'
                    break
                default:
                    responseType = this.responseType
                    break
            }
        }

        return {
            method: this.method,
            url: u.toString(),
            data: body,
            header: headers,
            dataType,
            responseType: this.responseType,
            withCredentials: this.withCredentials
        }
    }

    public toUniAppUploadRequest(): UniApp.UploadFileOption {
        const u: URL = new url(this.url, this.host)

        if (this.params) {
            u.search = this.params.merge(u.searchParams).toString()
        }

        let headers: {
            [key: string]: string
        } = {}

        if (this.headers) {
            headers = this.headers.toObject()
        }

        return {
            url: u.toString(),
            filePath: this.filePath,
            header: headers,
            name: 'file'
        }
    }
}
