import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VehicleDetails from './pages/VehicleDetails';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/vehicle' element={<VehicleDetails />} />
      </ Routes>
    </ BrowserRouter>
  )
}

export default App
