export interface Planet {
    name: string
    class: string,
    buildings: Array<string>,
    naturalResources: Array<string>, // Natural resources will be deposits that can be mined 
    resourceStorage: Array<string>, // Resource storage is how many resources are on that planet that are already mined and ready to be used. 
    production: [],
    hangar: Array<string>, // ships in the hangar can only be attacked by bombing the planet
    orbit: Array<string>, // ships in orbit can be attack in fleet combat like in regular space
    ownership: string,
}