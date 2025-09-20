import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VehicleDetails from './pages/VehicleDetails';
import Search from './pages/Search';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/vehicle' element={<VehicleDetails />} />
        <Route path='/search' element={<Search />} />
      </ Routes>
    </ BrowserRouter>
  )
}

export default App
