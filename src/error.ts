export class HttpErrorResponse{
    constructor(
        public readonly errorMsg: string,
        public readonly errorCode?: string,
        public readonly responseStatus?: number,
    ) {
    }
}
