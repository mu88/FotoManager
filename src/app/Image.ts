import * as pathparse from 'path-parse';

export class Image {
    path: string;
    numberOfCopies: number;
    fileExtension: string;
    fileName: string;
    fileDirectory: string;
    
    constructor(path: string) {
        this.path = path;
        this.numberOfCopies = 0;

        var parsedSourceFile = pathparse.win32(this.path);
        this.fileExtension = parsedSourceFile["ext"];
        this.fileName = parsedSourceFile["name"];
        this.fileDirectory = parsedSourceFile["dir"];
    }

    increase() {
        this.numberOfCopies++;
    }

    decrease() {
        if (this.numberOfCopies > 0) {
            this.numberOfCopies--;
        }
    }
}