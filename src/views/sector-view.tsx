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
  >/* Sector array goes in here */
  ([
    {
      systemStar: 'Blue-Giant',
      systemPlanets: [ 'Greenhouse1', 'Gas4' ],
      systemName: 'A-54467',
      cords: 'A-39155'
    },
    {
      systemStar: 'Red-Supergiant',
      systemPlanets: [ 'Temperate3', 'Frozen1', 'Greenhouse1' ],
      systemName: 'A-98727',
      cords: 'A-942'
    },
    {
      systemStar: 'Red-Giant',
      systemPlanets: [ 'Ocean5', 'Desert1', 'Frozen3', 'Temperate5', 'Asteroid-Belt3' ],
      systemName: 'A-36277',
      cords: 'A-66102'
    },
    {
      systemStar: 'Red-Giant',
      systemPlanets: [ 'Lava2' ],
      systemName: 'A-93901',
      cords: 'A-59244'
    },
    {
      systemStar: 'Red-Giant',
      systemPlanets: [
        'Desert1',
        'Lava2',
        'Asteroid-Belt3',
        'Gas2',
        'Rocky3',
        'Asteroid-Belt3',
        'Temperate3',
        'Asteroid-Belt3'
      ],
      systemName: 'A-32404',
      cords: 'A-57826'
    }
  ]
  )
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