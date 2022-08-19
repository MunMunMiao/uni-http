import { from, Observable, of } from 'rxjs'
import { HttpHeaders } from './headers'
import { HttpParams } from './params'
import { HttpRequest, Method } from './request'
import { HttpResponse } from './response'
import { HttpInterceptor } from './interceptor'
import { concatMap, switchMap } from 'rxjs/operators'
import { HttpHandler } from './backend'
import { HttpUniHandler } from './uni'

export class HttpClient {
    _handler: HttpHandler

    constructor(private init?: {
        host?: string
        interceptor?: HttpInterceptor[]
    }) {
        this._handler = new HttpUniHandler()
    }

    request<R>(options: {
        method: Method,
        url: string,
        body?: string | object | ArrayBuffer | null,
        headers?: HttpHeaders | { [key: string]: string },
        params?: HttpParams | { [key: string]: string },
        withCredentials?: boolean,
        httpResponseType?: 'json' | 'text' | 'arraybuffer',
        withInterceptor?: boolean
        filePath?: string
    }): Observable<HttpResponse<R>> {
        const req = new HttpRequest({
            host: this.init?.host,
            ...options
        })

        return this._request<R>(req)
    }

    private _request<R>(req: HttpRequest): Observable<HttpResponse<R>> {
        return of(req).pipe(
            switchMap(r => {
                const i: HttpInterceptor[] = []

                if (this.init?.interceptor && (req.withInterceptor !== false)) {
                    for (const int of this.init.interceptor) {
                        i.push(int)
                    }
                }

                return of(i).pipe(
                    switchMap(ii => {
                        if (ii.length > 0){
                            return from(ii).pipe(
                                concatMap(ii => ii.intercept(r, this._handler))
                            )
                        }else {
                            return this._handler.handle(r)
                        }
                    })
                )
            })
        )
    }

    get<R>(url: string, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R>>

    get(url: string, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'arraybuffer'
        withInterceptor?: boolean
    }): Observable<HttpResponse<ArrayBuffer>>

    get(url: string, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'text'
        withInterceptor?: boolean
    }): Observable<HttpResponse<string>>

    get<R>(url: string, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json' | 'text' | 'arraybuffer'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R> | HttpResponse<ArrayBuffer>> {
        return this.request<R>({
            url,
            method: 'GET',
            ...options
        })
    }

    post<R>(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R>>

    post(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'arraybuffer'
        withInterceptor?: boolean
    }): Observable<HttpResponse<ArrayBuffer>>

    post(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'text'
        withInterceptor?: boolean
    }): Observable<HttpResponse<string>>

    post<R>(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json' | 'text' | 'arraybuffer'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R> | HttpResponse<ArrayBuffer>> {
        return this.request<R>({
            url,
            body,
            method: 'POST',
            ...options
        })
    }

    put<R>(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R>>

    put(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'arraybuffer'
        withInterceptor?: boolean
    }): Observable<HttpResponse<ArrayBuffer>>

    put(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'text'
        withInterceptor?: boolean
    }): Observable<HttpResponse<string>>

    put<R>(url: string, body?: string | object | ArrayBuffer | null, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json' | 'text' | 'arraybuffer'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R> | HttpResponse<ArrayBuffer>> {
        return this.request<R>({
            url,
            body,
            method: 'PUT',
            ...options
        })
    }

    delete<R>(url: string, body: any, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R>>

    delete(url: string, body: any, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'text'
        withInterceptor?: boolean
    }): Observable<HttpResponse<string>>

    delete<R>(url: string, body: any, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        withCredentials?: boolean
        httpResponseType?: 'json' | 'text'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R> | HttpResponse<ArrayBuffer>> {
        return this.request<R>({
            url,
            method: 'DELETE',
            body,
            ...options
        })
    }

    upload<R>(url: string, filePath: string, options?: {
        headers?: HttpHeaders | { [key: string]: string }
        params?: HttpParams | { [key: string]: string }
        httpResponseType?: 'json' | 'text'
        withInterceptor?: boolean
    }): Observable<HttpResponse<R>> {
        return this.request<R>({
            url,
            method: 'POST',
            filePath,
            ...options
        })
    }
}
