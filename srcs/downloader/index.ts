import {validateArgs} from "./validation/validation";
import {downloadHttp} from "./protocols/http";
import {downloadHttps} from "./protocols/https";

/***
 * @param url Location of the file to download
 * @param destination Destination folder of the file to download
 * @param name Final name of the file to download
 * @param verbose Werther to print logs or not. Default to false because not needed in most of the cases.
 */
const downloader = (url: string, destination: string, name: string, verbose: boolean = false): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        validateArgs(url, destination, name)
            .then(async options => {
                try {
                    switch (options.protocol) {
                        case 'http:':
                            await downloadHttp(url, destination, name, verbose);
                            break;
                        case 'https:':
                            await downloadHttps(url, destination, name, verbose);
                            break;
                        //if we wanted:
                        // case 'ftp:':
                        //     await downloadFtp(url, destination, name, verbose, port, username, password);
                        //     break;
                    }
                    resolve(0);
                } catch (e) {
                    reject(e);
                }
        }).catch((reason) => reject(reason));
    });
}

export default downloader;
