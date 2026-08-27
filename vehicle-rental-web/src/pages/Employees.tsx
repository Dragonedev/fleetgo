import Navbar from '../components/Navbar'
import './Employees.css'

function Employees() {
  return (
    <div>
      <Navbar />

      <main className="employees-page">
        <div className="employees-header">
          <div>
            <h1>Funcionários</h1>
            <p>Gerencie os funcionários cadastrados no sistema.</p>
          </div>

          <button className="new-employee-button">
            + Novo funcionário
          </button>
        </div>

        <table className="employees-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>Cargo</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Exemplo</td>
              <td>EMP-001</td>
              <td>Atendente</td>
              <td>Ativo</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Employees