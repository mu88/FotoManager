import { Image } from './Image';
import * as path from 'path';

declare let electron: any;
declare let fs_extra: any;

export class Project {
    projectPath: string;
    images: Image[];
    currentImageIndex: number;
    exportStatus: string;

    constructor() {
        this.images = [];
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
              {name: "FotoManager-Projektdatei", extensions: ['json']}
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
            {name: "FotoManager-Projektdatei", extensions: ['json']}
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
        var exportCounter: number = 0;
        
        var options = {
          title: 'Bitte wählen Sie den Speicherort aus',
          properties: ['openDirectory']
        }
    
        electron.remote.dialog.showOpenDialog(options).forEach(destinationDirectory => {
          this.images.forEach(image => {
            for (var i = 0; i < image.numberOfCopies; i++)
            {
              this.refreshExportStatus(++exportCounter);
    
              var destinationFile = destinationDirectory + path.sep + image.fileName + "_" + i + image.fileExtension;
    
              fs_extra.copySync(image.path, destinationFile);
            }  
          });
        });
    
        this.exportStatus = "";
    }
    
    refreshExportStatus(exportCounter: number) {
        var percentage = 100 * (exportCounter / this.sumOfCopies);
        this.exportStatus = "Exportiere Kopie " + exportCounter + " von " + this.sumOfCopies + " (" +  percentage + "%)";
    }
    
    nextImage() {
        var maximumImageIndex = this.images.length - 1;
        if (this.currentImageIndex < maximumImageIndex) {
          this.currentImageIndex++;
        }
    }
    
    previousImage() {
        var minimumImageIndex = 0;
        if (this.currentImageIndex > minimumImageIndex) {
          this.currentImageIndex--;
        }
    }
}