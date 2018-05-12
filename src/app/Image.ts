import * as pathparse from 'path-parse';

export class Image {
    Path: string;
    NumberOfCopies: number;
    FileExtension: string;
    FileName: string;
    FileDirectory: string;
    
    constructor(path: string) {
        this.Path = path;
        this.NumberOfCopies = 0;

        var parsedSourceFile = pathparse.win32(this.Path);
        this.FileExtension = parsedSourceFile["ext"];
        this.FileName = parsedSourceFile["name"];
        this.FileDirectory = parsedSourceFile["dir"];
    }

    Increase() {
        this.NumberOfCopies++;
    }

    Decrease() {
        if (this.NumberOfCopies > 0) {
            this.NumberOfCopies--;
        }
    }
}