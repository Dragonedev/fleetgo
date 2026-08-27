import { NavLink } from 'react-router-dom'
import './Sidebar.css'

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <h2>FleetManager</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/rentals" className={({ isActive }) => (isActive ? 'active' : '')}>
          Locações
        </NavLink>
        <NavLink to="/vehicles" className={({ isActive }) => (isActive ? 'active' : '')}>
          Veículos
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => (isActive ? 'active' : '')}>
          Clientes
        </NavLink>
        <NavLink to="/employees" className={({ isActive }) => (isActive ? 'active' : '')}>
          Funcionários
        </NavLink>
      </nav>
    </aside>
  )
}