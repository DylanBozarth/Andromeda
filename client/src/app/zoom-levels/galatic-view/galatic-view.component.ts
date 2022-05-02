import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-galatic-view',
  templateUrl: './galatic-view.component.html',
  styleUrls: ['./galatic-view.component.css']
})
export class GalaticViewComponent implements OnInit {

  constructor() { }
  universe: [];
  ngOnInit() {
    let starList = [
      "Red-Giant",
      "Red-Supergiant",
      "Blue-Giant",
      "White-Dwarf",
      "Yellow-Dwarf",
      "Red-Dwarf",
      "Brown-Dwarf",
    ];
    let planetList = [
      "Rocky",
      "Temperate",
      "Ocean",
      "Frozen",
      "Lava",
      "Gas"
    ];
    let lengthOfStarList = starList.length;
    let lengthOfPlanetList = planetList.length;
    const letThereBeLight = () => {
      let universe = []
      const starNumber = 99;
      for (let i = 0; i < starNumber; i++) {
        universe.push({
          systemStar: starList[~~(Math.random() * lengthOfStarList)],
          systemPlanets: Array.from({ length: ~~(Math.random() * 9)}).map(x => planetList[~~(Math.random() * lengthOfPlanetList)])
        })
      }
      console.log(universe)
    }
 letThereBeLight();
  }

}
