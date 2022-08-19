import { Observable } from 'rxjs'
import { HttpRequest } from './request'
import { HttpResponse } from './response'

export abstract class HttpHandler {
    abstract handle(req: HttpRequest): Observable<HttpResponse>;
}
