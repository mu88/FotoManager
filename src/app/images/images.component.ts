import { Component, OnInit } from '@angular/core';
import { Image } from '../Image';
import { DomSanitizer } from '@angular/platform-browser';
import * as path from 'path';

declare let electron: any;
declare let fs: any;

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
  Images: Image[];
  CurrentImageIndex: number;
  ExportStatus: string;
  DomSanitizationService: DomSanitizer;

  constructor(private _DomSanitizationService: DomSanitizer) {
    this.Images = [];
    this.DomSanitizationService = _DomSanitizationService;
  }

  get NumberOfImages(): number {
    return this.Images.length;
  }

  get NumberOfCopies(): number {
    var copies: number = 0;
    this.Images.forEach(image => {
      copies += image.NumberOfCopies;
    });

    return copies;
  }

  get CurrentImage(): Image {
    return this.Images[this.CurrentImageIndex];
  }

  ngOnInit() {
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
      this.Images.push(new Image(filepath));
    });

    this.CurrentImageIndex = 0;
  }

  exportImages() {
    var exportCounter: number = 0;
    
    var options = {
      title: 'Bitte wählen Sie den Speicherort aus',
      properties: ['openDirectory']
    }

    electron.remote.dialog.showOpenDialog(options).forEach(destinationDirectory => {
      this.Images.forEach(image => {
        for (var i = 0; i < image.NumberOfCopies; i++)
        {
          this.RefreshExportStatus(++exportCounter);

          var destinationFile = destinationDirectory + path.sep + image.FileName + "_" + i + image.FileExtension;

          fs.copy(image.Path, destinationFile);
        }  
      });
    });

    this.ExportStatus = "";
  }

  RefreshExportStatus(exportCounter: number) {
    var percentage = 100 * (exportCounter / this.NumberOfCopies);
    this.ExportStatus = "Exportiere Kopie " + exportCounter + " von " + this.NumberOfCopies + " (" +  percentage + "%)";
  }

  nextImage() {
    var maximumImageIndex = this.Images.length - 1;
    if (this.CurrentImageIndex < maximumImageIndex) {
      this.CurrentImageIndex++;
    }
  }

  previousImage() {
    var minimumImageIndex = 0;
    if (this.CurrentImageIndex > minimumImageIndex) {
      this.CurrentImageIndex--;
    }
  }
}