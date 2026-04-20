import { Link } from 'react-router-dom'
import styles from './PokemonCard.module.css'

const TYPE_COLORS = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
  fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
  poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
  ghost: '#705898', steel: '#B8B8D0',
}

export default function PokemonCard({ name, url }) {
  const id = url.split('/').filter(Boolean).pop()
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

  return (
    <Link to={`/pokemon/${name}`} className={styles.card}>
      <img src={sprite} alt={name} width={96} height={96} loading="lazy" />
      <p className={styles.id}>#{String(id).padStart(3, '0')}</p>
      <h3 className={styles.name}>{name}</h3>
    </Link>
  )
}
