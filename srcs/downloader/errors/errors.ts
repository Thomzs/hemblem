export class DownloaderError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);

        this.name = "Downloader Error";
        this.message = message;
        this.stack = (<any> new Error()).stack;
        this.code = code;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DownloaderError.prototype);
    }
}