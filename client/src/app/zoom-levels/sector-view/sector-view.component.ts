import { Component, OnInit,  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sector-view',
  templateUrl: './sector-view.component.html',
  styleUrls: ['./sector-view.component.css']
})
export class SectorViewComponent implements OnInit {
currentSystem: string = "cheese"
@Output() messageEvent = new EventEmitter<string>();
changeText() {
  this.currentSystem = "not cheese"
}
  constructor() { }
  sector = [
      {
        systemStar: 'Red-Supergiant',
        systemName: 'A64122',
        systemPlanets: [
          'Gas', 'Gas',
          'Frozen', 'Frozen',
          'Lava', 'Frozen',
          'Gas', 'Frozen'
        ],
        distanceFromTop: 400,
        distanceFromLeft: 360
      },
      {
        systemStar: 'Blue-Giant',
        systemName: 'A49627',
        systemPlanets: ['Lava'],
        distanceFromTop: 463,
        distanceFromLeft: 163
      },
      {
        systemStar: 'Red-Giant',
        systemName: 'A50889',
        systemPlanets: ['Rocky', 'Frozen'],
        distanceFromTop: 71,
        distanceFromLeft: 434
      },
      {
        systemStar: 'Yellow-Dwarf',
        systemName: 'A60984',
        systemPlanets: ['Frozen', 'Temperate', 'Rocky', 'Lava', 'Ocean'],
        distanceFromTop: 138,
        distanceFromLeft: 638
      },
      {
        systemStar: 'Red-Supergiant',
        systemName: 'A35421',
        systemPlanets: ['Rocky', 'Ocean', 'Temperate', 'Gas', 'Lava'],
        distanceFromTop: 13,
        distanceFromLeft: 899
      },
      {
        systemStar: 'Red-Dwarf',
        systemName: 'A48843',
        systemPlanets: ['Rocky', 'Gas'],
        distanceFromTop: 856,
        distanceFromLeft: 523
      },
      {
        systemStar: 'Yellow-Dwarf',
        systemName: 'A63396',
        systemPlanets: ['Temperate', 'Gas', 'Lava', 'Gas', 'Rocky'],
        distanceFromTop: 810,
        distanceFromLeft: 250
      },
      {
        systemStar: 'Blue-Giant',
        systemName: 'A82856',
        systemPlanets: ['Rocky'],
        distanceFromTop: 874,
        distanceFromLeft: 472
      },
      {
        systemStar: 'Red-Giant',
        systemName: 'A38881',
        systemPlanets: [],
        distanceFromTop: 742,
        distanceFromLeft: 556
      },
  ];
  sectorName = "Sector 1"
  ngOnInit() {
  }

}
