import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'

import Vehicles from './pages/Vehicles/Vehicles'
import VehicleForm from './pages/Vehicles/VehicleForm'
import VehicleEdit from './pages/Vehicles/VehicleEdit'

import Customers from './pages/Customers/Customers'
import Employees from './pages/Employees/Employees'

import RentalOrders from './pages/RentalOrders/Rentals'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/new" element={<VehicleForm />} />
        <Route path="/vehicles/edit/:id" element={<VehicleEdit />} />

        <Route path="/customers" element={<Customers />} />

        <Route path="/employees" element={<Employees />} />

        <Route path="/rentals" element={<RentalOrders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App