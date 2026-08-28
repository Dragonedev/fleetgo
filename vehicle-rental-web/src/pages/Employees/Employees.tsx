import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import { Modal } from '../../components/Modal'
import './Employees.css'

// =========================================================
// TIPOS E INTERFACES
// =========================================================

const API_URL = '${import.meta.env.VITE_API_URL}/v1/employees'

interface Employee {
  id: number
  name: string
  employeeCode: string
  email: string
  phone: string
  position: string
  active: boolean
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

function Employees() {
  // =========================================================
  // STATES
  // =========================================================

  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null)
  const [employeeNameToDelete, setEmployeeNameToDelete] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // =========================================================
  // TRATAMENTO DE ERROS
  // =========================================================

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof TypeError) {
      return 'Não foi possível conectar ao servidor. Verifique se a API está funcionando.'
    }

    if (error instanceof Error) {
      return error.message
    }

    return 'Ocorreu um erro inesperado. Tente novamente.'
  }

  const getApiErrorMessage = (status: number, data: any): string => {
    if (data?.message) {
      return data.message
    }

    if (data?.error) {
      return data.error
    }

    switch (status) {
      case 400:
        return 'Os dados informados são inválidos.'
      case 401:
        return 'Você não está autorizado a realizar esta operação.'
      case 403:
        return 'Você não tem permissão para realizar esta operação.'
      case 404:
        return 'O recurso solicitado não foi encontrado.'
      case 409:
        return 'Não foi possível realizar a operação porque existe um conflito nos dados.'
      case 500:
        return 'Ocorreu um erro interno no servidor.'
      case 502:
      case 503:
        return 'O servidor está temporariamente indisponível.'
      default:
        return 'Não foi possível realizar a operação. Tente novamente.'
    }
  }

  // =========================================================
  // FUNÇÕES AUXILIARES
  // =========================================================

  const getEmployeeInitial = (name: string) => {
    return name.trim().charAt(0).toUpperCase() || 'E'
  }

  const getEmployeeCode = (employee: Employee) => {
    return employee.employeeCode || `EMP-${String(employee.id).padStart(3, '0')}`
  }

  const getPosition = (position: string) => {
    return position || 'Não especificado'
  }

  // =========================================================
  // REQUISIÇÕES
  // =========================================================

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(getApiErrorMessage(response.status, data))
      }

      const data = await response.json()
      const employeesData = Array.isArray(data) ? data : data.content || []

      setEmployees(employeesData)
    } catch (err) {
      console.error('Erro ao buscar funcionários:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleDeleteClick = (id: number, name: string) => {
    setEmployeeToDelete(id)
    setEmployeeNameToDelete(name)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return

    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/${employeeToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        if (response.status === 409) {
          throw new Error(
            'Este funcionário não pode ser excluído pois possui locações ativas.'
          )
        }

        throw new Error(getApiErrorMessage(response.status, data))
      }

      setEmployees((currentEmployees) =>
        currentEmployees.filter((employee) => employee.id !== employeeToDelete)
      )

      setShowDeleteModal(false)
      setEmployeeToDelete(null)
      setEmployeeNameToDelete('')
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false)
      setEmployeeToDelete(null)
      setEmployeeNameToDelete('')
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  const renderStatusBadge = (active: boolean) => {
    return active ? (
      <span className="badge badge-success">Ativo</span>
    ) : (
      <span className="badge badge-danger">Inativo</span>
    )
  }

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="page-wrapper">
      <main className="employees-page">
        <header className="employees-header">
          <div>
            <span className="page-label">FLEETGO</span>
            <h1>Funcionários</h1>
            <p>Gerencie os funcionários da sua operação.</p>
          </div>

          <Link to="/employees/new" className="new-employee-button">
            <span>+</span>
            Novo Funcionário
          </Link>
        </header>

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
              <div className="loading-state">
                <div className="loading-spinner" />
                <span>Carregando funcionários...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button type="button" onClick={loadEmployees} className="retry-button">
                  Tentar novamente
                </button>
              </div>
            ) : employees.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum funcionário cadastrado.</p>
                <Link to="/employees/new" className="empty-state-link">
                  Cadastrar primeiro funcionário
                </Link>
              </div>
            ) : (
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Funcionário</th>
                    <th>Código</th>
                    <th>Cargo</th>
                    <th>Status</th>
                    <th className="actions-column">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-info">
                          <div className="employee-avatar">
                            {getEmployeeInitial(employee.name)}
                          </div>
                          <div>
                            <strong>{employee.name}</strong>
                            <span>{employee.email || 'Colaborador'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="employee-code">{getEmployeeCode(employee)}</span>
                      </td>
                      <td>
                        <span className="employee-position">{getPosition(employee.position)}</span>
                      </td>
                      <td>{renderStatusBadge(employee.active)}</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/employees/${employee.id}/edit`} className="action-button">
                            Editar
                          </Link>
                          <button
                            type="button"
                            className="action-button danger"
                            onClick={() => handleDeleteClick(employee.id, employee.name)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <Modal
        isOpen={showDeleteModal}
        title="Excluir Funcionário"
        icon="👔"
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isDeleting}
        size="sm"
      >
        <p>
          Tem certeza que deseja excluir o funcionário{' '}
          <strong style={{ color: '#f9fafb' }}>{employeeNameToDelete}</strong>?
        </p>
        <p style={{ 
          color: '#f87171', 
          fontSize: '14px',
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⚠️</span> Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}

export default Employees