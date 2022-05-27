import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "../components/star";
import "../styles/views-styles/sector-view.css"
import { SystemView } from "./system-view";
interface playerSystemProps {
playerSystem: Object,
setPlayerSystem: Function
}

export const SectorView: React.FC<playerSystemProps> = ({playerSystem, setPlayerSystem}) => {
  const [sector, setSector] = React.useState<
    Array<{
      systemName: String,
      systemStar: String,
      systemPlanets: Array<String>,
      cords: String,
    }>
  >([
    {
      systemStar: 'Red-Dwarf',
      systemPlanets: [ 'Gas', 'Frozen', 'Frozen' ],
      systemName: 'A-35066',
      cords: 'A-76087'
    },
    {
      systemStar: 'Red-Dwarf',
      systemPlanets: [ 'Lava', 'Rocky', 'Lava', 'Temperate', 'Rocky', 'Ocean', 'Gas' ],
      systemName: 'A-86769',
      cords: 'A-25631'
    },
    {
      systemStar: 'White-Dwarf',
      systemPlanets: [
        'Lava',      'Ocean',
        'Temperate', 'Lava',
        'Rocky',     'Frozen',
        'Lava',      'Ocean'
      ],
      systemName: 'A-22201',
      cords: 'A-8536'
    },
    {
      systemStar: 'Red-Dwarf',
      systemPlanets: [
        'Ocean', 'Rocky',
        'Gas',   'Temperate',
        'Gas',   'Frozen',
        'Lava',  'Frozen'
      ],
      systemName: 'A-79672',
      cords: 'A-6450'
    },
    {
      systemStar: 'Yellow-Dwarf',
      systemPlanets: [ 'Temperate', 'Rocky' ],
      systemName: 'A-48624',
      cords: 'A-59890'
    }
  ])
  {
    return (
      <div className="sector-view-wrapper">
      {sector.map((sector) => {
        return (
          <div className="sector-star-wrapper">
          <Link to={`/system/${sector.systemName}`} onClick={() => setPlayerSystem({sector})} >
            <Star systemName={sector.systemName} systemStar={sector.systemStar}   />
          
          </Link>
          </div>
        )
      })}
      
      Eventually I want these to look more random in their placements so there can be clusters, etc.
      </div>
    )
    
  }
}