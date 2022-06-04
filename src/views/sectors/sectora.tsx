import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "../../components/star";
import "../../styles/views-styles/sector-view.css"
interface playerSystemProps {
playerSystem: Object,
setPlayerSystem: Function
}

export const SectorA: React.FC<playerSystemProps> = ({playerSystem, setPlayerSystem}) => {
  const [sector, setSector] = React.useState<
    Array<{
      systemName: String,
      systemStar: String,
      systemPlanets: Array<String>,
      cords: String,
      id: Number,
      hangar: Array<String>
    }>
  >/* Sector array goes in here */
  ([
    {
      systemStar: 'White-Dwarf',
      systemPlanets: [
        'Lava1',
        'Gas1',
        'Desert1',
        'Desert1',
        'Greenhouse1',
        'Lava2',
        'Temperate5'
      ],
      systemName: 'A-55523',
      cords: 'A-37711',
      id: 70974,
      hangar: []
    },
    {
      systemStar: 'Blue-Giant',
      systemPlanets: [ 'Frozen2', 'Ocean4', 'Desert1' ],
      systemName: 'A-52448',
      cords: 'A-5104',
      id: 77442,
      hangar: []
    },
    {
      systemStar: 'Blue-Giant',
      systemPlanets: [
        'Frozen2',
        'Ocean1',
        'Asteroid-Belt3',
        'Frozen3',
        'Ocean1',
        'Temperate2'
      ],
      systemName: 'A-82030',
      cords: 'A-68730',
      id: 48587,
      hangar: []
    },
    {
      systemStar: 'Yellow-Dwarf',
      systemPlanets: [
        'Rocky4',
        'Rocky3',
        'Frozen1',
        'Greenhouse1',
        'Temperate2',
        'Temperate4',
        'Asteroid-Belt2'
      ],
      systemName: 'A-84822',
      cords: 'A-83527',
      id: 52711,
      hangar: []
    },
    {
      systemStar: 'Red-Dwarf',
      systemPlanets: [ 'Greenhouse1', 'Greenhouse1', 'Gas4' ],
      systemName: 'A-34147',
      cords: 'A-13315',
      id: 55685,
      hangar: []
    }
  ]
  )
  {
    return (
      <div className="sector-view-wrapper">
      {sector.map((sector) => {
        return (
          <div className="sector-star-wrapper" >
          <Link to={`/system/${sector.systemName}`} onClick={() => setPlayerSystem({sector})}>
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