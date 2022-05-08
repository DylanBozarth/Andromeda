// this is for making a bunch of random stars
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
        let sector = []
        const starNumber = 99;
        for (let i = 0; i < starNumber; i++) {
          sector.push({
            systemStar: starList[~~(Math.random() * lengthOfStarList)],
            systemName: `A${Math.floor(Math.random()*90000) + 10000}`,
            systemPlanets: Array.from({ length: ~~(Math.random() * 9)}).map(x => planetList[~~(Math.random() * lengthOfPlanetList)]),
            Xcord: (Math.floor(Math.random()*900) + 10)
          })
        }
        console.log(sector)
      }
      letThereBeLight();