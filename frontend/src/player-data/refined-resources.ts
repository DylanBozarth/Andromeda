export const playerRefinedResources = 
    {
        'fuel': 0,
        'biomass': 0,
        'food': 0,
        'approval': 0,
        'alloys': 0,
        'metals': 0,
        'ceramics': 0,
        'plastics': 0,
        'energy': 0,
    }

/*
These resources can only be produced or traded. Mining will not get you these resources they must come from a building.
1. fuel will come from either gas or oil desposits
2. biomass will come from farms. population can eat it but they won't be happy. It can be converted to food and fermented grain for approval bonuses, 
but with diminishing returns. Example 100 biomass becomes 30 food and 10 fermented grain
3. Metals come from ore -- used to make simple ships and buildings
4. Alloys will come from ore and refined minerals  -- used for more complex ships and buildings
5. ceramics and plastics also come from ore AND oil -- player must make the choice when using minerals to make them into metal or ceramics and plastics
6. Energy will come from power plants. Power plants can be powered by solar power (free but not effective). 
or they can be powered by burning biomass or gas (high returns but expensive)
7. Approval will affect how well everything is produced. High approval will mean a flat bonus to all resources, including population growth.
Low approval will be a flat debuff to all resources. 0 approval for a long time will result in the system losing player control 

*/