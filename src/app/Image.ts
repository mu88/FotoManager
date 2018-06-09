import * as pathparse from 'path-parse';
import * as EXIF from 'exif-js';

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

    getExifData() {
        var img = document.getElementById("img");
        EXIF.getData(img, function() {
            console.log(this["src"]);
            console.log(EXIF.getTag(this, "Orientation"));
            console.log(EXIF.getTag(this, "DateTimeOriginal"));
        });
    }

    decrease() {
        if (this.numberOfCopies > 0) {
            this.numberOfCopies--;
        }
    }
}