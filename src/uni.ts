import { HttpHandler } from './backend'
import { HttpRequest } from './request'
import { HttpResponse } from './response'
import { Observable } from 'rxjs'
import { HttpErrorResponse } from './error'

export class HttpUniHandler implements HttpHandler{
    handle(req: HttpRequest): Observable<HttpResponse> {
        return new Observable<HttpResponse>(subscriber => {
            let task: UniApp.RequestTask | UniApp.UploadTask | undefined

            if (req.method === 'POST' && req.filePath){
                task = uni.uploadFile({
                    ...req.toUniAppUploadRequest(),
                    fail: err => {
                        subscriber.error(err)
                    },
                    success: result => {
                        subscriber.next(new HttpResponse({
                            statusCode: result.statusCode,
                            // @ts-ignore
                            header: result.header,
                            data: result.data as any
                        }))
                        subscriber.complete()
                    },
                    complete: () => {
                        subscriber.complete()
                    }
                })
            }else {
                task = uni.request({
                    ...req.toUniAppRequest(),
                    success: result => {
                        if (result.statusCode >= 200 && result.statusCode < 300){
                            subscriber.next(new HttpResponse({
                                statusCode: result.statusCode,
                                header: result.header,
                                data: result.data as any
                            }))
                            subscriber.complete()
                        }else {
                            subscriber.error(new HttpErrorResponse(
                                (result?.data as any)?.errorMsg || '',
                                (result?.data as any)?.errorCode || '',
                                result.statusCode,
                            ))
                        }
                    },
                    fail: err => {
                        subscriber.error(new HttpErrorResponse(err.errMsg))
                    },
                    complete: result => {
                        if (result.errMsg) {
                            subscriber.error(new HttpErrorResponse(result.errMsg))
                        } else {
                            subscriber.complete()
                        }
                    }
                })
            }

            return () => {
                if (task) {
                    task.abort()
                }
            }
        })
    }
}
