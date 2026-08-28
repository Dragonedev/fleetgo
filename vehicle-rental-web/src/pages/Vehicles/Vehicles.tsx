import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import { Modal } from '../../components/Modal'
import './Vehicles.css'

// =========================================================
// TIPOS E INTERFACES
// =========================================================

interface Vehicle {
  id: number
  brand: string
  model: string
  licensePlate: string
  year: number
  mileage: number
  dailyRate: number
  status: VehicleStatus
}

type VehicleStatus =
  | 'AVAILABLE'
  | 'RENTED'
  | 'MAINTENANCE'
  | 'UNAVAILABLE'
  | string

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

function Vehicles() {
  // =========================================================
  // STATES
  // =========================================================

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null)
  const [vehicleNameToDelete, setVehicleNameToDelete] = useState('')
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

  const getStatusLabel = (status: VehicleStatus) => {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
      case 'DISPONIVEL':
        return 'Disponível'
      case 'RENTED':
      case 'ALUGADO':
        return 'Alugado'
      case 'MAINTENANCE':
      case 'MANUTENCAO':
        return 'Manutenção'
      case 'UNAVAILABLE':
      case 'INDISPONIVEL':
        return 'Indisponível'
      default:
        return status
    }
  }

  const getStatusClass = (status: VehicleStatus) => {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
      case 'DISPONIVEL':
        return 'available'
      case 'RENTED':
      case 'ALUGADO':
        return 'rented'
      case 'MAINTENANCE':
      case 'MANUTENCAO':
        return 'maintenance'
      case 'UNAVAILABLE':
      case 'INDISPONIVEL':
        return 'unavailable'
      default:
        return 'unknown'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // =========================================================
  // REQUISIÇÕES
  // =========================================================

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('${import.meta.env.VITE_API_URL}/v1/vehicles')

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(getApiErrorMessage(response.status, data))
      }

      const data = await response.json()
      setVehicles(Array.isArray(data) ? data : data.content || [])
    } catch (err) {
      console.error('Erro ao buscar veículos:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleDeleteClick = (id: number, name: string) => {
    setVehicleToDelete(id)
    setVehicleNameToDelete(name)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return

    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/vehicles/${vehicleToDelete}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        if (response.status === 409) {
          throw new Error(
            'Este veículo não pode ser excluído pois possui locações ativas.'
          )
        }

        throw new Error(getApiErrorMessage(response.status, data))
      }

      setVehicles((currentVehicles) =>
        currentVehicles.filter((vehicle) => vehicle.id !== vehicleToDelete)
      )

      setShowDeleteModal(false)
      setVehicleToDelete(null)
      setVehicleNameToDelete('')
    } catch (err) {
      console.error('Erro ao excluir veículo:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false)
      setVehicleToDelete(null)
      setVehicleNameToDelete('')
    }
  }

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="page-wrapper">
      <main className="vehicles-page">
        <header className="vehicles-header">
          <div>
            <span className="page-label">FLEETGO</span>
            <h1>Veículos</h1>
            <p>Gerencie os veículos disponíveis para locação.</p>
          </div>

          <Link to="/vehicles/new" className="new-vehicle-button">
            <span>+</span>
            Novo veículo
          </Link>
        </header>

        <section className="vehicles-card">
          <div className="vehicles-card-header">
            <div>
              <h2>Veículos cadastrados</h2>
              <p>Visualize e gerencie os veículos da frota.</p>
            </div>
            <span className="vehicle-count">
              {vehicles.length} {vehicles.length === 1 ? 'veículo' : 'veículos'}
            </span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <span>Carregando veículos...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button type="button" onClick={loadVehicles} className="retry-button">
                  Tentar novamente
                </button>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum veículo cadastrado.</p>
                <Link to="/vehicles/new" className="empty-state-link">
                  Cadastrar primeiro veículo
                </Link>
              </div>
            ) : (
              <table className="vehicles-table">
                <thead>
                  <tr>
                    <th>Veículo</th>
                    <th>Placa</th>
                    <th>Ano</th>
                    <th>Diária</th>
                    <th>Status</th>
                    <th className="actions-column">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <div className="vehicle-info">
                          <div className="vehicle-avatar">
                            {vehicle.brand.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{vehicle.model}</strong>
                            <span>{vehicle.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="vehicle-plate">{vehicle.licensePlate}</span>
                      </td>
                      <td>{vehicle.year}</td>
                      <td>
                        <span className="daily-rate">{formatCurrency(vehicle.dailyRate)}</span>
                      </td>
                      <td>
                        <span className={`status ${getStatusClass(vehicle.status)}`}>
                          {getStatusLabel(vehicle.status)}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/vehicles/${vehicle.id}/edit`} className="action-button">
                            Editar
                          </Link>
                          <button
                            type="button"
                            className="action-button danger"
                            onClick={() => handleDeleteClick(vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
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
        title="Excluir Veículo"
        icon="🚗"
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isDeleting}
        size="sm"
      >
        <p>
          Tem certeza que deseja excluir o veículo{' '}
          <strong style={{ color: '#f9fafb' }}>{vehicleNameToDelete}</strong>?
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

export default Vehicles