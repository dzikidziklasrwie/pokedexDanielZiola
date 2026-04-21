import { useState, useEffect, useRef } from 'react'
import PokemonCard from '../components/PokemonCard'
import styles from './Pokedex.module.css'

const LIMIT = 20

function getStat(pokemon, statName) {
  return pokemon.stats.find(s => s.stat.name === statName)?.base_stat ?? 0
}

export default function Pokedex() {
  const [allNames, setAllNames] = useState([])       // all ~1025 names from API
  const [details, setDetails] = useState([])          // full data for current page slice
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [error, setError] = useState(null)

  // Filter state
  const [search, setSearch] = useState('')
  const [minHP, setMinHP] = useState(0)
  const [minATK, setMinATK] = useState(0)
  const [minDEF, setMinDEF] = useState(0)

  const searchRef = useRef(null)

  // Fetch all names once on mount
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
      .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json() })
      .then(data => setAllNames(data.results))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Compute filtered name list from search
  const filteredNames = allNames.filter(p =>
    p.name.includes(search.toLowerCase().trim())
  )
  const totalPages = Math.ceil(filteredNames.length / LIMIT)
  const pageSlice = filteredNames.slice(page * LIMIT, (page + 1) * LIMIT)

  // Stable key so the effect re-runs whenever the actual slice content changes
  // (including when allNames first loads — page/search alone won't catch that)
  const sliceKey = pageSlice.map(p => p.name).join(',')

  // Fetch full details for current page slice (needed for stat filtering)
  useEffect(() => {
    if (!sliceKey) { setDetails([]); return }
    setLoadingDetails(true)
    const cancelled = { value: false }
    Promise.all(
      sliceKey.split(',').map(name =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(r => r.json())
      )
    )
      .then(data => { if (!cancelled.value) setDetails(data) })
      .catch(e => { if (!cancelled.value) setError(e.message) })
      .finally(() => { if (!cancelled.value) setLoadingDetails(false) })
    return () => { cancelled.value = true }
  }, [sliceKey])

  // Apply stat filters — when all sliders are 0 every pokemon passes (>= 0 is always true)
  const displayed = details.filter(p =>
    getStat(p, 'hp') >= minHP &&
    getStat(p, 'attack') >= minATK &&
    getStat(p, 'defense') >= minDEF
  )

  const hasStatFilters = minHP > 0 || minATK > 0 || minDEF > 0

  function handleSearch(val) {
    setSearch(val)
    setPage(0)
  }

  function goToPage(val) {
    const num = Number(val)
    if (!val || isNaN(num)) return
    const clamped = Math.max(0, Math.min(num - 1, totalPages - 1))
    setPage(clamped)
  }

  function clearFilters() {
    setSearch('')
    setMinHP(0)
    setMinATK(0)
    setMinDEF(0)
    setPage(0)
    searchRef.current?.focus()
  }

  if (loading) return <p className={styles.loading}>Loading Pokédex...</p>
  if (error) return <p className={styles.error}>Error: {error}</p>

  return (
    <div>
      <h1 className={styles.title}>Pokédex</h1>

      <div className={styles.filterBar}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={searchRef}
            className={styles.searchInput}
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => handleSearch('')}>✕</button>
          )}
        </div>

        {/* Stat sliders */}
        <div className={styles.sliders}>
          <label className={styles.sliderLabel}>
            <span>Min HP <strong>{minHP}</strong></span>
            <input type="range" min={0} max={150} value={minHP}
              onChange={e => setMinHP(Number(e.target.value))} className={styles.slider} />
          </label>
          <label className={styles.sliderLabel}>
            <span>Min ATK <strong>{minATK}</strong></span>
            <input type="range" min={0} max={150} value={minATK}
              onChange={e => setMinATK(Number(e.target.value))} className={styles.slider} />
          </label>
          <label className={styles.sliderLabel}>
            <span>Min DEF <strong>{minDEF}</strong></span>
            <input type="range" min={0} max={150} value={minDEF}
              onChange={e => setMinDEF(Number(e.target.value))} className={styles.slider} />
          </label>
        </div>

        {(search || hasStatFilters) && (
          <button className={styles.resetBtn} onClick={clearFilters}>Reset all filters</button>
        )}
      </div>

      {/* Results info */}
      {(search || hasStatFilters) && !loadingDetails && (
        <p className={styles.resultInfo}>
          {search && <span>Searching "<strong>{search}</strong>" — {filteredNames.length} match{filteredNames.length !== 1 ? 'es' : ''}.</span>}
          {hasStatFilters && <span> Showing {displayed.length} of {details.length} on this page after stat filters.</span>}
        </p>
      )}

      {loadingDetails ? (
        <p className={styles.loading}>Loading Pokémon…</p>
      ) : displayed.length === 0 ? (
        <p className={styles.noResults}>No Pokémon match your filters. Try adjusting them.</p>
      ) : (
        <div className={styles.grid}>
          {displayed.map(p => <PokemonCard key={p.name} pokemon={p} />)}
        </div>
      )}

      <div className={styles.pagination}>
        <button className={styles.btn} onClick={() => setPage(p => p - 1)}
          disabled={page === 0 || loadingDetails}>
          ← Previous
        </button>
        <span className={styles.pageInfo}>
          Page
          <input
            className={styles.pageInput}
            type="number"
            min={1}
            max={totalPages || 1}
            value={page + 1}
            onChange={e => goToPage(e.target.value)}
            disabled={loadingDetails}
          />
          of {totalPages || 1}
        </span>
        <button className={styles.btn} onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1 || loadingDetails}>
          Next →
        </button>
      </div>
    </div>
  )
}
