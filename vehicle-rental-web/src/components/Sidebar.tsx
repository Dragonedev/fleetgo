import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSidebar } from '../context/SidebarContext'
import logo from '../assets/fleetgo-logo-primary.svg'  // ← LOGO PRIMARY SVG
import './Sidebar.css'

function Sidebar() {
  const { isOpen, close } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()

  const [searchRentalId, setSearchRentalId] = useState('')
  const [searchError, setSearchError] = useState('')

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/customers', label: 'Clientes', icon: '👥' },
    { path: '/vehicles', label: 'Veículos', icon: '🚗' },
    { path: '/rentals', label: 'Locações', icon: '📋' },
    { path: '/employees', label: 'Funcionários', icon: '👔' },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleSearchRental = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchError('')

    const id = parseInt(searchRentalId.trim())

    if (!searchRentalId.trim()) {
      setSearchError('Digite o ID da locação')
      return
    }

    if (isNaN(id) || id <= 0) {
      setSearchError('Digite um ID válido (número positivo)')
      return
    }

    close()
    navigate(`/rentals/${id}`)
    setSearchRentalId('')
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* HEADER */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img
              src={logo}
              alt="FleetGo"
              className="brand-logo"
            />
          </div>
          <button
            type="button"
            className="sidebar-close"
            onClick={close}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        {/* BUSCA DE LOCAÇÃO */}
        <div className="sidebar-search">
          <form onSubmit={handleSearchRental}>
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar locação por ID..."
                value={searchRentalId}
                onChange={(e) => {
                  setSearchRentalId(e.target.value)
                  setSearchError('')
                }}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Ir
              </button>
            </div>
            {searchError && (
              <span className="search-error">{searchError}</span>
            )}
          </form>
        </div>

        {/* MENU */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={close}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Administrador</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar