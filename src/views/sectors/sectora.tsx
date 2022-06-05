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
      systemPlanets: Object,
      cords: String,
      ownership: String,
      hangar: Array<String>
    }>
  >/* Sector array goes in here */
  ([
    {
      systemStar: 'Red-Giant',
      systemPlanets: {
        Ocean5: [Array],
        Greenhouse4: [Array],
        Frozen2: [Array],
        Frozen4: [Array],
        Frozen3: [Array],
        Greenhouse2: [Array],
        Rocky1: [Array]
      },
      systemName: 'A-82371',
      cords: 'A-95764',
      ownership: 'A-90110',
      hangar: []
    },
    {
      systemStar: 'Blue-Giant',
      systemPlanets: {
        'Asteroid-Belt2': [Array],
        'Asteroid-Belt1': [Array],
        Desert1: [Array],
        Ocean5: [Array],
        Ocean4: [Array],
        Temperate2: [Array],
        Ocean3: [Array]
      },
      systemName: 'A-25299',
      cords: 'A-30482',
      ownership: 'A-48660',
      hangar: []
    },
    {
      systemStar: 'Brown-Dwarf',
      systemPlanets: { Temperate4: [Array], Gas5: [Array], Rocky3: [Array] },
      systemName: 'A-33151',
      cords: 'A-38453',
      ownership: 'A-12898',
      hangar: []
    },
    {
      systemStar: 'Brown-Dwarf',
      systemPlanets: { Lava3: [Array], Greenhouse3: [Array], Frozen5: [Array] },
      systemName: 'A-73573',
      cords: 'A-31026',
      ownership: 'A-58824',
      hangar: []
    },
    {
      systemStar: 'Red-Giant',
      systemPlanets: { Desert2: [Array], Lava3: [Array], Greenhouse3: [Array] },
      systemName: 'A-10479',
      cords: 'A-68095',
      ownership: 'A-66209',
      hangar: []
    },
    {
      systemStar: 'Red-Supergiant',
      systemPlanets: { Gas2: [Array], Lava3: [Array] },
      systemName: 'A-95116',
      cords: 'A-33505',
      ownership: 'A-97829',
      hangar: []
    },
    {
      systemStar: 'Red-Supergiant',
      systemPlanets: { Ocean2: [Array] },
      systemName: 'A-12091',
      cords: 'A-46372',
      ownership: 'A-71892',
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