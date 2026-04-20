import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './PokemonDetail.module.css'

const TYPE_COLORS = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
  fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
  poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
  ghost: '#705898', steel: '#B8B8D0',
}

const STAT_LABELS = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'Sp.ATK', 'special-defense': 'Sp.DEF', speed: 'SPD',
}

export default function PokemonDetail() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(r => {
        if (!r.ok) throw new Error('Pokémon not found')
        return r.json()
      })
      .then(setPokemon)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [name])

  if (loading) return <p className={styles.loading}>Loading...</p>
  if (error) return <p className={styles.error}>{error}</p>

  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default

  const mainType = pokemon.types[0].type.name
  const bgColor = TYPE_COLORS[mainType] ?? '#aaa'

  return (
    <div>
      <Link to="/" className={styles.back}>← Back to Pokédex</Link>

      <div className={styles.card} style={{ '--type-color': bgColor }}>
        <div className={styles.hero}>
          <img src={sprite} alt={pokemon.name} width={200} height={200} />
          <div className={styles.heroInfo}>
            <p className={styles.idBadge}>#{String(pokemon.id).padStart(3, '0')}</p>
            <h1 className={styles.pokeName}>{pokemon.name}</h1>
            <div className={styles.types}>
              {pokemon.types.map(t => (
                <span
                  key={t.type.name}
                  className={styles.typeBadge}
                  style={{ background: TYPE_COLORS[t.type.name] ?? '#aaa' }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <section className={styles.section}>
            <h2>Profile</h2>
            <div className={styles.profileGrid}>
              <div className={styles.profileItem}>
                <span className={styles.label}>Height</span>
                <span>{(pokemon.height / 10).toFixed(1)} m</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.label}>Weight</span>
                <span>{(pokemon.weight / 10).toFixed(1)} kg</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.label}>Base XP</span>
                <span>{pokemon.base_experience ?? '—'}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Abilities</h2>
            <div className={styles.abilities}>
              {pokemon.abilities.map(a => (
                <span key={a.ability.name} className={styles.ability}>
                  {a.ability.name}{a.is_hidden ? ' (hidden)' : ''}
                </span>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Base Stats</h2>
            <div className={styles.stats}>
              {pokemon.stats.map(s => (
                <div key={s.stat.name} className={styles.statRow}>
                  <span className={styles.statLabel}>
                    {STAT_LABELS[s.stat.name] ?? s.stat.name}
                  </span>
                  <span className={styles.statValue}>{s.base_stat}</span>
                  <div className={styles.barBg}>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${Math.min(100, (s.base_stat / 255) * 100)}%`,
                        background: bgColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
