import React, { useState } from "react";



export const SectorView = () => {
  const [sector, setSector] = React.useState<
    Array<{
      systemName: String,
      systemStar: String,
      systemPlanets: Array<String>,
      distanceFromTop: Number,
      distanceFromLeft: Number
    }>
  >([
    {
      systemStar: 'Red-Supergiant',
      systemName: 'A64122',
      systemPlanets: [
        'Gas', 'Gas',
        'Frozen', 'Frozen',
        'Lava', 'Frozen',
        'Gas', 'Frozen'
      ],
      distanceFromTop: 400,
      distanceFromLeft: 360
    },
  ])

  {
    return (
      <div>astast
      {sector.map((sector) => {
        return (
          <p>{sector.systemName}</p>
        )
      })}
      </div>
    )
    
  }
}