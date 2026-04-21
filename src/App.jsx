import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Pokedex from './pages/Pokedex'
import PokemonDetail from './pages/PokemonDetail'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Pokedex /> },
      { path: 'pokemon/:name', element: <PokemonDetail /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
