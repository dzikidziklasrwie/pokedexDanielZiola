import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.wrapper}>
      <h1>About This Pokédex</h1>
      <p>
        This Pokédex is a React application that lets you browse and explore
        information about all Pokémon. Use it to look up types, stats,
        abilities, height, and weight for any Pokémon.
      </p>

      <h2>How to use</h2>
      <ul>
        <li>Browse the list of Pokémon on the <strong>Pokédex</strong> page.</li>
        <li>Use the <strong>Previous</strong> and <strong>Next</strong> buttons to paginate through all Pokémon.</li>
        <li>Click on any Pokémon card to see its detailed information.</li>
      </ul>

      <h2>Tech stack</h2>
      <ul>
        <li>React + Vite</li>
        <li>React Router (hash-based routing)</li>
        <li><a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a> — free, open Pokémon data</li>
      </ul>
    </div>
  )
}
