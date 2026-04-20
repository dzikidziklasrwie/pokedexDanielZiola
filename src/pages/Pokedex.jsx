import { useState, useEffect } from 'react'
import PokemonCard from '../components/PokemonCard'
import styles from './Pokedex.module.css'

const LIMIT = 20

export default function Pokedex() {
  const [pokemon, setPokemon] = useState([])
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${LIMIT}&offset=${page * LIMIT}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then(data => {
        setPokemon(data.results)
        setTotal(data.count)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <h1 className={styles.title}>Pokédex</h1>

      {error && <p className={styles.error}>Error: {error}</p>}

      {loading ? (
        <p className={styles.loading}>Loading Pokémon...</p>
      ) : (
        <div className={styles.grid}>
          {pokemon.map(p => (
            <PokemonCard key={p.name} name={p.name} url={p.url} />
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.btn}
          onClick={() => setPage(p => p - 1)}
          disabled={page === 0 || loading}
        >
          ← Previous
        </button>
        <span className={styles.pageInfo}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          className={styles.btn}
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1 || loading}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
