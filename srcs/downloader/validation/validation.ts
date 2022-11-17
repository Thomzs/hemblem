import {DownloaderError} from "../errors/errors";
import {EMPTY_NAME, INVALID_DESTINATION, INVALID_URL, UNSUPPORTED_PROTOCOL} from "../errors/errorCodes";
import * as fs from "fs";

const { URL, parse } = require('url');

const stringIsAValidUrl = (s: string, protocols: string[]) => {
    new URL(s);
    const parsed = parse(s);
    return parsed.protocol && protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
            ? parsed
            : false;
};

const validateUrl = (url: string): any => {
    try {
        let parsed = stringIsAValidUrl(url, ['http', 'https']);
        if (parsed === false) {
            throw new DownloaderError('Unsupported protocol. Currently supporting http, https and ftp',
                UNSUPPORTED_PROTOCOL);
        }

        return parsed;
    } catch (e) {
        if (e instanceof DownloaderError) throw e;
        else throw new DownloaderError(`Invalid url: ${url}`, INVALID_URL);
    }
}

const validateDestination = async (dest: string) => {
    return new Promise<void>((resolve, reject) => {
        try {
            if (!fs.lstatSync(dest).isDirectory()) {
                throw Error();
            }
            fs.access(dest, fs.constants.W_OK, (err => reject(err)));
            resolve();
        } catch (e) {
            reject(new DownloaderError(`Error with destination ${dest}. Either it's not a folder, it does not exist` +
                " or you don't have write permissions", INVALID_DESTINATION));
        }
    });
}

const validateName = (destination: string, name: string): any => {
    if (name === '') {
        throw new DownloaderError("Name cannot be empty", EMPTY_NAME);
    }
}

export const validateArgs = async (url: string, destination: string, name: string): Promise<any> => {
    await validateDestination(destination);
    validateName(destination, name);
    return validateUrl(url);
}