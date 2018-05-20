import { Image } from './Image';
import * as path from 'path';

declare let electron: any;
declare let fs_extra: any;

export class Project {
    projectPath: string;
    images: Image[];
    currentImageIndex: number;
    duringExport: boolean;
    progressValue: number;
    exportStatus: string;

    constructor() {
        this.images = [];
        this.duringExport = false;
        this.progressValue = 0;
    }

    get numberOfImages(): number {
        return this.images.length;
    }
    
    get sumOfCopies(): number {
        var copies: number = 0;

        if (this.images) {
            this.images.forEach(image => {
                copies += image.numberOfCopies;
            });
        }        

        return copies;
    }
    
    get currentImage(): Image {
        return this.images[this.currentImageIndex];
    }

    saveProject() {
        if (!this.projectPath) {
    
          var options = {
            title: 'Bitte wählen Sie den Speicherort der Projektdatei aus',
            defaultPath: electron.remote.app.getAppPath(),
            filters: [
              {name: "Projektdatei", extensions: ['json']}
            ]
          }
      
          this.projectPath = electron.remote.dialog.showSaveDialog(options);
        }

        var exportObject = this.convertToExportObject(this);
    
        fs_extra.writeJsonSync(this.projectPath, exportObject);
    }

    convertToExportObject(project: Project) {
        var exportObject: any = new Object;        
        exportObject.projectPath = project.projectPath;
        exportObject.currentImageIndex = project.currentImageIndex;
        exportObject.images = [];
        project.images.forEach(image => {
            var exportImage: any = new Object;
            exportImage.path = image.path;
            exportImage.numberOfCopies = image.numberOfCopies;

            exportObject.images.push(exportImage);
        });

        return exportObject;
    }
    
    loadProject() {
        var options = {
          title: 'Bitte wählen Sie Ihre Projektdatei aus',
          filters: [
            {name: "Projektdatei", extensions: ['json']}
          ],
          properties: ['openFile']
        }
        
        this.projectPath = electron.remote.dialog.showOpenDialog(options)[0];
    
        var json = fs_extra.readJsonSync(this.projectPath);

        this.projectPath = json.projectPath;
        this.currentImageIndex = json.currentImageIndex;
        this.images = [];
        json.images.forEach(item => {
            var image = new Image(item.path);
            image.numberOfCopies = item.numberOfCopies;
            this.images.push(image);
        });
    }

    openImages() {
        var options = {
          title: 'Bitte wählen Sie Ihre Bilder aus',
          filters: [
            {name: "Bilder", extensions: ['jpg', 'png', 'gif']}
          ],
          properties: ['openFile', 'multiSelections']
        }
        
        electron.remote.dialog.showOpenDialog(options).forEach(filepath => {
          this.images.push(new Image(filepath));
        });
    
        this.currentImageIndex = 0;
    }

    exportImages() {
        this.duringExport = true;
        this.progressValue = 0;

        var localImageCounter: number = 0;
        var destinationDirectory: string;

        var options = {
          title: 'Bitte wählen Sie den Speicherort aus',
          properties: ['openDirectory']
        }
    
        electron.remote.dialog.showOpenDialog(options).forEach(destinationDirectory => {
          this.images.forEach(image => {
            for (var i = 0; i < image.numberOfCopies; i++)
            {
                localImageCounter++;
                
                this.progressValue = 100 * (localImageCounter / this.sumOfCopies);
                
                var destinationFile = destinationDirectory + path.sep + image.fileName + "_" + i + image.fileExtension;
    
                fs_extra.copySync(image.path, destinationFile);
            }  
          });
        });

        this.duringExport = false;
        this.exportStatus = "Export erfolgreich abgeschlossen!";
    }
    
    nextImage(increment: number) {
        var maximumImageIndex = this.images.length - 1;
        var imageIndexAfterIncrement = this.currentImageIndex + increment;
        if (imageIndexAfterIncrement > maximumImageIndex) {
            this.currentImageIndex = maximumImageIndex;
        }
        else {
            this.currentImageIndex = imageIndexAfterIncrement;
        }
    }
    
    previousImage(decrement: number) {
        var minimumImageIndex = 0;
        var imageIndexAfterDecrement = this.currentImageIndex - decrement;
        if (imageIndexAfterDecrement < minimumImageIndex) {
            this.currentImageIndex = minimumImageIndex;
        }
        else {
            this.currentImageIndex = imageIndexAfterDecrement;
        }
    }
}