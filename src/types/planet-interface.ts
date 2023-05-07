export interface Planet {
    name: string
    buildings: Array<string>,
    naturalResources: Array<string>,
    resourceStorage: Array<string>,
    production: [],
    hangar: Array<string>,
    ownership: string
}

// Natural resources will be deposits that can be mined 
// Resource storage is how many resources are on that planet that are already mined and ready to be used. 