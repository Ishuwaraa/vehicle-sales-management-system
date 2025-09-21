import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import AddVehicle from './pages/AddVehicle';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<PrivateRoute element={<Home />} />} />
          <Route path='/login' element={<Login />} />
          <Route path='/vehicle/add' element={<PrivateRoute element={<AddVehicle />} />} />
        </ Routes>
      </ BrowserRouter>
    </AuthProvider>
  )
}

export default App
