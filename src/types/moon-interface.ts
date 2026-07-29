export interface Moon {
  name: string;
  parentPlanet: string;
  averageTemperatureC: number | null;
  terrain: string[];
  atmosphere: { type: string; composition: string[] } | null;
}
