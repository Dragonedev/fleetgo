import Navbar from '../../components/Navbar'
import './Employees.css'

function Employees() {
  return (
    <div>
      <Navbar />

      <main className="employees-page">

        <div className="employees-header">
          <div>
            <span className="page-label">FLEETGO</span>
            <h1>Funcionários</h1>
            <p>Gerencie os funcionários da sua operação.</p>
          </div>

          <button className="new-employee-button">
            <span>+</span>
            Novo funcionário
          </button>
        </div>

        <section className="employees-card">

          <div className="employees-card-header">
            <div>
              <h2>Funcionários cadastrados</h2>
              <p>Visualize e gerencie os funcionários do sistema.</p>
            </div>

            <span className="employee-count">
              1 funcionário
            </span>
          </div>

          <div className="table-wrapper">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th>Código</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        E
                      </div>

                      <div>
                        <strong>Exemplo</strong>
                        <span>Funcionário cadastrado</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="employee-code">
                      EMP-001
                    </span>
                  </td>

                  <td>Atendente</td>

                  <td>
                    <span className="status active">
                      Ativo
                    </span>
                  </td>

                  <td>
                    <button className="action-button">
                      Editar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>

      </main>
    </div>
  )
}

export default Employees