import { NavLink } from 'react-router-dom'
import { useSidebar } from '../context/SidebarContext'
import logo from '../assets/fleetgo-logo-primary.svg'  // ← IMPORTANDO A LOGO SVG
import './Navbar.css'

function Navbar() {
  const { toggle } = useSidebar()

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="menu-button"
            onClick={toggle}
            aria-label="Abrir menu"
          >
            ☰
          </button>

          <NavLink to="/" className="navbar-logo">
            <img
              src={logo}
              alt="FleetGo"
              className="navbar-brand-logo"
            />
          </NavLink>
        </div>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Início
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
          <NavLink to="/rentals" className={({ isActive }) => (isActive ? 'active' : '')}>
            Locações
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar