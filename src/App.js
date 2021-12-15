import React, { useState } from 'react';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import imgs from './imagesExport';

function App() {
  const [state, setState] = useState({
    PlanetList: null,
  });
  const [planetState, setPlanetState] = useState({
    singlePName: '',
    population: 0,
  });

  const numberWithCommas = (x) => {
    if (x === null) {
      return 'Unknown';
    } else {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  const selectPlanet = (e) => {
    let dataPoint = state.PlanetList.find((p) => p.id === e.target.id);
    setPlanetState({
      singlePName: dataPoint.name,
      population: numberWithCommas(dataPoint.population),
    });
    document.querySelector('.singlePContainer').classList.toggle('hide');
  };

  const hideSingle = () => {
    document.querySelector('.singlePContainer').classList.toggle('hide');
  };

  useEffect(() => {
    fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query: `
      query ExampleQuery {
        allPlanets {
          planets {
            id
            name
            population
            climates
            surfaceWater
            terrains
            gravity
            filmConnection {
              films {
                title
              }
            }
          }
        }
      }
      `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const trueData = data.data.allPlanets.planets.filter(
          (planet) => planet.filmConnection.films.length >= 1
        );
        setState({ PlanetList: trueData });
      });
  }, []);

  if (state.PlanetList === null) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  } else {
    return (
      <div className="">
        <Navbar />
        <div className="singlePContainer hide">
          <div className="pText">
            <div className="singlePName">{planetState.singlePName}</div>
            <div className="population">
              Population: {planetState.population}
            </div>
            <div className="exit" onClick={hideSingle}>
              EXIT
            </div>
          </div>
          <img
            src={imgs[planetState.singlePName]}
            alt={planetState.singlePName + 'picture'}
            className="singlePPicture"
          />
        </div>
        <div className="PlanetsList">
          {state.PlanetList.map((planet) => {
            return (
              <div
                className="pContainer"
                key={planet.id}
                id={planet.id}
                onClick={selectPlanet}
              >
                <img
                  src={imgs[planet.name]}
                  alt={planet.name + 'picture'}
                  id={planet.id}
                  className="pPicture"
                />
                <div className="pName">{planet.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
