import { HttpRequest } from './request'
import { HttpResponse } from './response'
import { HttpHandler } from './backend'
import { Observable } from 'rxjs'

export interface HttpInterceptor {
    intercept(req: HttpRequest, next: HttpHandler): Observable<HttpResponse>;
}


/**
 * Noop 拦截器
 */
export class NoopInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest, next: HttpHandler): Observable<HttpResponse> {
        return next.handle(req)
    }
}
