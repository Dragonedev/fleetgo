import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Vehicle Rental</h2>

      <div className="navbar-links">
        <a href="/">Início</a>
        <a href="/vehicles">Veículos</a>
        <a href="/customers">Clientes</a>
        <a href="/employees">Funcionários</a>
        <a href="/rentals">Locações</a>
      </div>
    </nav>
  )
}

export default Navbar