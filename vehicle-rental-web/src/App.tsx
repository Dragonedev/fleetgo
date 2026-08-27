import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'

import Vehicles from './pages/Vehicles/Vehicles'
import VehicleForm from './pages/Vehicles/VehicleForm'
import VehicleEdit from './pages/Vehicles/VehicleEdit'

import Customers from './pages/Customers/Customers'
import CustomerForm from './pages/Customers/CustomerForm'
import CustomerEdit from './pages/Customers/CustomerEdit'

import Employees from './pages/Employees/Employees'
import EmployeeForm from './pages/Employees/EmployeeForm'
import EmployeeEdit from './pages/Employees/EmployeeEdit'

import RentalOrders from './pages/RentalOrders/Rentals'
import RentalForm from './pages/RentalOrders/RentalForm'
import RentalEdit from './pages/RentalOrders/RentalEdit'
import RentalDetails from './pages/RentalOrders/RentalDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Veículos */}
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/new" element={<VehicleForm />} />
        <Route path="/vehicles/:id/edit" element={<VehicleEdit />} />

        {/* Clientes */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/new" element={<CustomerForm />} />
        <Route path="/customers/:id/edit" element={<CustomerEdit />} />

        {/* Funcionários */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

        {/* Aluguéis / Locações */}
        <Route path="/rentals" element={<RentalOrders />} />
        <Route path="/rentals/new" element={<RentalForm />} />
        <Route path="/rentals/:id" element={<RentalDetails />} />
        <Route path="/rentals/:id/edit" element={<RentalEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App