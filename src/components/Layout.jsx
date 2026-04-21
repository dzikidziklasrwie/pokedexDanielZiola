import { Outlet, NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.pokeball} aria-hidden="true">⊙</span>
          Pokédex
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>
            Pokédex
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>
      </footer>
    </div>
  )
}
