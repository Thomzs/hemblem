import {WriteStream} from "fs";
import * as fs from "fs";
import * as http from "http";
import {DownloaderError} from "../errors/errors";
import {DOWNLOAD_ERROR} from "../errors/errorCodes";

export const downloadHttp = async (url: string, destination: string, name: string, verbose: boolean): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        try {
            const file: WriteStream = fs.createWriteStream(destination + name);

            if (verbose) console.log(`Connecting to ${url}`);

            const request = http.get(url, function (response) {
                response.pipe(file);

                if (verbose) console.log(`Saving the file to ${destination + name}`);

                // after download completed close filestream
                file.on("finish", () => {
                    file.close();
                    if (verbose) console.log("Download Completed");
                    resolve(0);
                });
            });
        } catch (e) {
            reject(new DownloaderError(e.message, DOWNLOAD_ERROR));
        }
    });
}
