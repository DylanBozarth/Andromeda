import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sector-view',
  templateUrl: './sector-view.component.html',
  styleUrls: ['./sector-view.component.css']
})
export class SectorViewComponent implements OnInit {

  constructor() { }
  sector = [
    { systemStar: "White-Dwarf", systemName: "A74263", systemPlanets: (5) },
    { systemStar: "Red-Dwarf", systemName: "A49802", systemPlanets: (5) },
    { systemStar: "Brown-Dwarf", systemName: "A10580", systemPlanets: (1) },
    { systemStar: "Brown-Dwarf", systemName: "A62683", systemPlanets: (6) },
    { systemStar: "Brown-Dwarf", systemName: "A70766", systemPlanets: (1) },
    { systemStar: "Red-Supergiant", systemName: "A55550", systemPlanets: (2) },
    { systemStar: "White-Dwarf", systemName: "A57671", systemPlanets: (3) },
    { systemStar: "White-Dwarf", systemName: "A72054", systemPlanets: (2) },
    { systemStar: "White-Dwarf", systemName: "A74776", systemPlanets: (2) },
    { systemStar: "Brown-Dwarf", systemName: "A18290", systemPlanets: (3) },

  ];
  sectorName = "Sector 1"
  ngOnInit() {

  }

}
