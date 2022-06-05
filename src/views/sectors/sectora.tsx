import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "../../components/star";
import "../../styles/views-styles/sector-view.css"
interface playerSystemProps {
  playerSystem: Object,
  setPlayerSystem: Function
}

export const SectorA: React.FC<playerSystemProps> = ({ playerSystem, setPlayerSystem }) => {
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
        systemStar: "Red-Supergiant",
        systemPlanets: {
          Lava5: [
            "water-low",
            "water-trace"
          ]
        },
        systemName: "A-53866",
        cords: "A-88977",
        ownership: "A-57455",
        hangar: []
      },
      {
        systemStar: "Red-Dwarf",
        systemPlanets: {
          Lava1: [
            "population-tribal",
            "oil-low"
          ],
          Temperate2: [
            "ore-trace",
            "oil-medium"
          ],
          Rocky2: [
            "ore-medium",
            "gas-low"
          ],
          Desert5: [
            "gas-low",
            "oil-low"
          ]
        },
        systemName: "A-75679",
        cords: "A-45803",
        ownership: "A-95889",
        hangar: []
      },
      {
        systemStar: "Red-Supergiant",
        systemPlanets: {
          "Ocean2": [
            "water-high",
            "oil-low"
          ]
        },
        systemName: "A-42060",
        cords: "A-38347",
        ownership: "A-65577",
        hangar: []
      },
      {
        systemStar: "Red-Dwarf",
        systemPlanets: {
          Rocky1: [
            "population-scarce",
            "ore-high"
          ],
          Ocean4: [
            "ore-high",
            "gas-medium"
          ],
          Gas4: [
            "oil-medium",
            "ore-trace"
          ],
          Temperate5: [
            "ore-high",
            "gas-low"
          ]
        },
        systemName: "A-67200",
        cords: "A-42633",
        ownership: "A-44987",
        hangar: []
      },
      {
        systemStar: "White-Dwarf",
        systemPlanets: {
          "Greenhouse4": [
            "oil-medium",
            "water-low"
          ],
          Rocky3: [
            "ore-trace",
            "oil-medium"
          ]
        },
        systemName: "A-99226",
        cords: "A-78159",
        ownership: "A-76323",
        hangar: []
      },
      {
        systemStar: "Red-Giant",
        systemPlanets: {
          "Asteroid-Belt1": [
            "water-medium",
            "gas-medium"
          ]
        },
        systemName: "A-11584",
        cords: "A-95129",
        ownership: "A-64591",
        hangar: []
      },
      {
        systemStar: "Blue-Giant",
        systemPlanets: {
          Temperate5: [
            "water-medium",
            "water-trace"
          ],
          Temperate3: [
            "oil-medium",
            "water-medium"
          ]
        },
        systemName: "A-33329",
        cords: "A-23198",
        ownership: "A-86544",
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
              <Link to={`/system/${sector.systemName}`} onClick={() => setPlayerSystem({ sector })}>
                <Star systemName={sector.systemName} systemStar={sector.systemStar} />

              </Link>
            </div>
          )
        })}

        Eventually I want these to look more random in their placements so there can be clusters, etc.
      </div>
    )

  }
}