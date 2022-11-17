import downloader from "./srcs/downloader";

const { program } = require('commander');

const name: string = "prog";

program
    .requiredOption('-u, --url <url>', 'Location of the file to be downloaded')
    .option('-d, --destination <path>', 'Destination folder of the file', '.')
    .requiredOption('-a, --as <name>', 'New name of the file')
    .option('-q, --quiet', 'No logs printed except errors');

program.name(name)
    .description('CLI to download a file and store it on the disk.')
    .version('1.0.0');

program.action(async (options) => {
    let ret: number = 0;

    try {
        ret = await downloader(options.url, options.destination, options.as, !options.quiet);
    } catch (e) {
        //errors codes with output here;
        console.error(`Error: ${e.message}`);
        if (e.code) ret = e.code;
        else ret = 1;
    }
    if (ret !== 0) {
        console.error(`hemblem exited with status code ${ret}`);
    }
    process.exit(ret);
});

program.parse();