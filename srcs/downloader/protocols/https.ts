import {WriteStream} from "fs";
import * as fs from "fs";
import {DownloaderError} from "../errors/errors";
import {DOWNLOAD_ERROR} from "../errors/errorCodes";
import * as https from "https";

export const downloadHttps = async (url: string, destination: string, name: string, verbose: boolean): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        try {
            const file: WriteStream = fs.createWriteStream(destination + name);

            if (verbose) console.log(`Connecting to ${url}`);

            const request = https.get(url, function (response) {
                if (response.statusCode !== 200) {
                    reject(new DownloaderError(`Request has returned with status ${response.statusCode}`,
                        DOWNLOAD_ERROR));
                    return;
                }
                response.pipe(file);

                if (verbose) console.log(`Saving the file to ${destination  + name}`);

                // after download completed close filestream
                file.on("finish", () => {
                    file.close();
                    if (verbose) console.log("Download Completed");
                    resolve(0);
                });
            }).on('error', (e) => {
                console.log(e.message);
                reject(new DownloaderError(e.message, DOWNLOAD_ERROR));
            });
        } catch (e) {
            reject(new DownloaderError(e.message, DOWNLOAD_ERROR));
        }
    });
}