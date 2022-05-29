// Delete the generateSector.js file after getting data from it or this will throw syntax errors.

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
  "Rocky1",
  "Rocky2",
  "Rocky3",
  "Rocky4",
  "Rocky5",
  "Temperate1",
  "Temperate2",
  "Temperate3",
  "Temperate4",
  "Temperate5",
  "Ocean1",
  "Ocean2",
  "Ocean3",
  "Ocean4",
  "Ocean5",
  "Frozen1",
  "Frozen2",
  "Frozen3",
  "Frozen4",
  "Frozen5",
  "Lava1",
  "Lava2",
  "Lava3",
  "Lava4",
  "Lava5",
  "Gas1",
  "Gas2",
  "Gas3",
  "Gas4",
  "Gas5",
  "Desert1",
  "Desert1",
  "Desert1",
  "Desert1",
  "Desert1",
  "Greenhouse1",
  "Greenhouse1",
  "Greenhouse1",
  "Greenhouse1",
  "Greenhouse1",
  "Asteroid-Belt1",
  "Asteroid-Belt2",
  "Asteroid-Belt3"
];
function makePlanets() {
  return []
}
let lengthOfStarList = starList.length;
let lengthOfPlanetList = planetList.length;
const letThereBeLight = () => {
  let universe = []
  const starNumber = 5;
  for (let i = 0; i < starNumber; i++) {
    universe.push({
      systemStar: starList[~~(Math.random() * lengthOfStarList)],
      systemPlanets: Array.from({ length: ~~(Math.random() * 9) }).map(x => planetList[~~(Math.random() * lengthOfPlanetList)]),
      systemName: `A-${Math.floor(Math.random() * 90000) + 10000}`,
      cords: `A-${Math.floor(Math.random() * 90000) + 100}`,
      id: `${Math.floor(Math.random() * 90000) + 100}`,
      hangar: []
    })
  }
  console.log(universe)
}
letThereBeLight();
