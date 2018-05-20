import * as pathparse from 'path-parse';

declare let sizeOf: any;

export class Image {
    path: string;
    numberOfCopies: number;
    fileExtension: string;
    fileName: string;
    fileDirectory: string;
    private _isLandscape: boolean;
    
    constructor(path: string) {
        this.path = path;
        this.numberOfCopies = 0;

        var parsedSourceFile = pathparse.win32(this.path);
        this.fileExtension = parsedSourceFile["ext"];
        this.fileName = parsedSourceFile["name"];
        this.fileDirectory = parsedSourceFile["dir"];
        this._isLandscape = null;
    }

    get isLandscape(): boolean {
        if (this._isLandscape === null) {
            var dimensions = sizeOf(this.path);
            if (dimensions.width > dimensions.height) {
                this._isLandscape = true;
            }
            else {
                this._isLandscape = false;
            }
        }
         return this._isLandscape;
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