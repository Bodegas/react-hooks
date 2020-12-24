// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from "../pokemon";

const PokemonErrorFallback = ({error}) => (
  <div role="alert">
    There was an error:{" "}
    <pre style={{whiteSpace: "normal"}}>{error.message}</pre>
  </div>
);

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    status: "idle",
    pokemon: null,
    error: null,
  });
  const {status, pokemon, error} = state;

  useEffect(() => {
    setState({...state, status: "idle"});
    const fetchPokemonData = async pokemonName => {
      try {
        setState({...state, status: "pending"});
        const pokemonData = await fetchPokemon(pokemonName);
        setState({...state, pokemon: pokemonData, status: "resolved"});
      } catch (error) {
        setState({...state, error, status: "rejected"});
      }
    };
    if (pokemonName) {
      fetchPokemonData(pokemonName);
    }
  }, [pokemonName]);

  if (status === "idle") {
    return "Submit a pokemon";
  }
  if (status === "pending") {
    return <PokemonInfoFallback name={pokemonName} />;
  }
  if (status === "rejected") {
    throw error;
  }
  if (status === "resolved") {
    return <PokemonDataView pokemon={pokemon} />;
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          key={pokemonName}
          FallbackComponent={PokemonErrorFallback}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
