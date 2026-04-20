import { Link } from 'react-router-dom'
import styles from './PokemonCard.module.css'

export default function PokemonCard({ pokemon }) {
  const { id, name, sprites } = pokemon
  const sprite = sprites.other?.['official-artwork']?.front_default || sprites.front_default

  return (
    <Link to={`/pokemon/${name}`} className={styles.card}>
      <img src={sprite} alt={name} width={96} height={96} loading="lazy" />
      <p className={styles.id}>#{String(id).padStart(3, '0')}</p>
      <h3 className={styles.name}>{name}</h3>
    </Link>
  )
}
