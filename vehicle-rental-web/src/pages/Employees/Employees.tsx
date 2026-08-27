import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './Employees.css'

interface Employee {
  id: number
  name: string
  employeeCode?: string
  position?: string
  role?: string // Mantido como fallback caso o backend antigo retorne role
  email?: string
  phone?: string
  active?: boolean
}

function Employees() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8085/v1/employees')
      const data = await response.json()
      // Extrai data.content garantindo compatibilidade com o Page<T> do Spring Boot
      setEmployees(Array.isArray(data) ? data : data.content || [])
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir/desativar este funcionário?')) return

    try {
      const response = await fetch(`http://localhost:8085/v1/employees/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id))
      } else {
        alert('Não foi possível excluir o funcionário.')
      }
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error)
    }
  }

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

          <button className="new-employee-button" onClick={() => navigate('/employees/new')}>
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
              {employees.length} {employees.length === 1 ? 'funcionário' : 'funcionários'}
            </span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
                Carregando funcionários...
              </div>
            ) : (
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Funcionário</th>
                    <th>Código</th>
                    <th>Cargo</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>
                        Nenhum funcionário cadastrado.
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => {
                      const initial = employee.name ? employee.name.charAt(0).toUpperCase() : 'E'
                      const isInactive = employee.active === false
                      const currentPosition = employee.position || employee.role || 'Não especificado'

                      return (
                        <tr key={employee.id}>
                          <td>
                            <div className="employee-info">
                              <div className="employee-avatar">{initial}</div>
                              <div>
                                <strong>{employee.name}</strong>
                                <span>{employee.email || 'Colaborador'}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="employee-code">
                              {employee.employeeCode || `EMP-${String(employee.id).padStart(3, '0')}`}
                            </span>
                          </td>

                          <td>{currentPosition}</td>

                          <td>
                            <span className={`status ${isInactive ? 'inactive' : 'active'}`}>
                              {isInactive ? 'Inativo' : 'Ativo'}
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="action-button"
                              onClick={() => navigate(`/employees/${employee.id}/edit`)}
                            >
                              Editar
                            </button>
                            <button
                              className="action-button danger"
                              style={{ marginLeft: '8px' }}
                              onClick={() => handleDelete(employee.id)}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Employees