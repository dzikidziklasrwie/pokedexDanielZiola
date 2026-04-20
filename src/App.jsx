import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Pokedex from './pages/Pokedex'
import PokemonDetail from './pages/PokemonDetail'
import About from './pages/About'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Pokedex /> },
      { path: 'pokemon/:name', element: <PokemonDetail /> },
      { path: 'about', element: <About /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
