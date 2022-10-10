export interface Ship {
    name: string
    power: number
    shield: number
    attack: number
    hull: number
    navigation: number 
    buildTime: number  
    cost: number       
}

export const ship1: Ship ={
    name: 'The Buzzard',
    power: 500,
    shield: 900,
    attack: 200,
    hull: 600,
    navigation: 75,
    buildTime: 30,
    cost: 1000,
}