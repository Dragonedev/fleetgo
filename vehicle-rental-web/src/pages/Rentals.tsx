import Navbar from '../components/Navbar'
import './Rentals.css'

function Rentals() {
  return (
    <div>
      <Navbar />

      <main className="rentals-page">
        <div className="rentals-header">
          <div>
            <h1>Locações</h1>
            <p>Gerencie as locações de veículos do sistema.</p>
          </div>

          <button className="new-rental-button">
            + Nova locação
          </button>
        </div>

        <table className="rentals-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Veículo</th>
              <th>Data de retirada</th>
              <th>Data de devolução</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Exemplo</td>
              <td>Corolla</td>
              <td>27/08/2026</td>
              <td>30/08/2026</td>
              <td>Ativa</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Rentals