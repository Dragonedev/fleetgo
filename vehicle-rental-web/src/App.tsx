import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { SidebarProvider } from './context/SidebarContext'

import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'

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

// ✅ IMPORTE O COMPONENTE PAYMENT
import Payment from './pages/Payment/Payment'  // Se estiver dentro de RentalOrders
// OU
// import Payment from './pages/payment/Payment'  // Se estiver em pages/payment/

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="app">
          <Navbar />
          <Sidebar />
          <main className="app-content">
            <Routes>
              {/* HOME */}
              <Route path="/" element={<Home />} />

              {/* DASHBOARD */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* VEHICLES */}
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/new" element={<VehicleForm />} />
              <Route path="/vehicles/:id/edit" element={<VehicleEdit />} />

              {/* CUSTOMERS */}
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/:id/edit" element={<CustomerEdit />} />

              {/* EMPLOYEES */}
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

              {/* RENTALS */}
              <Route path="/rentals" element={<RentalOrders />} />
              <Route path="/rentals/new" element={<RentalForm />} />
              <Route path="/rentals/:id" element={<RentalDetails />} />
              <Route path="/rentals/:id/edit" element={<RentalEdit />} />

              {/* ✅ ADICIONE A ROTA DE PAGAMENTO AQUI */}
              <Route path="/rentals/:id/payment" element={<Payment />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App