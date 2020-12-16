// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from "react";
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from "../pokemon";

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = useState(null);
  useEffect(() => {
    const fetchPokemonData = async pokemonName => {
      const pokemonData = await fetchPokemon(pokemonName);
      setPokemon(pokemonData);
    };
    if (pokemonName) {
      fetchPokemonData(pokemonName);
    }
    return () => setPokemon(null);
  }, [pokemonName]);

  if (!pokemonName) {
    return null;
  }

  if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />;
  }

  return <PokemonDataView pokemon={pokemon} />;
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
