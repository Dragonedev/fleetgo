import Navbar from '../components/Navbar'
import './Home.css'

function Home() {
  return (
    <div>
      <Navbar />

      <main className="home">
        <div className="home-content">
          <h1>Vehicle Rental</h1>

          <p>
            Sistema de gerenciamento de locação de veículos
          </p>

          <a href="/vehicles" className="home-button">
            Ver veículos
          </a>
        </div>
      </main>
    </div>
  )
}

export default Home