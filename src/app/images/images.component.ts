import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Project } from "../Project";

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
  project: Project;
  DomSanitizationService: DomSanitizer;

  constructor(private _DomSanitizationService: DomSanitizer) {
    this.DomSanitizationService = _DomSanitizationService;
    this.project = new Project();
  }

  ngOnInit() {
  }
}