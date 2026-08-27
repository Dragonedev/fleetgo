import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Vehicles from './pages/Vehicles'
import Customers from './pages/Customers'
import Employees from './pages/Employees'
import Rentals from './pages/Rentals'
import VehicleForm from './pages/VehicleForm'
import VehicleEdit from './pages/VehicleEdit'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/vehicles/new" element={<VehicleForm />} />
        <Route path="/vehicles/:id/edit" element={<VehicleEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App