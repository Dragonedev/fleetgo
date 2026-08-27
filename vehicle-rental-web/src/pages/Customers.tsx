import Navbar from '../components/Navbar'
import './Customers.css'

function Customers() {
  return (
    <div>
      <Navbar />

      <main className="customers-page">
        <div className="customers-header">
          <div>
            <h1>Clientes</h1>
            <p>Gerencie os clientes cadastrados no sistema.</p>
          </div>

          <button className="new-customer-button">
            + Novo cliente
          </button>
        </div>

        <table className="customers-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Exemplo</td>
              <td>000.000.000-00</td>
              <td>(00) 00000-0000</td>
              <td>Ativo</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Customers