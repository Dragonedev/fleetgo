import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import './Rentals.css'

const API_URL = 'http://localhost:8085'

interface RentalDetail {
  id: number
  customerId: number
  vehicleId: number
  employeeId: number
  startDate: string
  endDate: string
  status: string
  paymentMethod?: string
  paymentStatus?: string
  totalAmount?: number

  customer?: {
    id: number
    name: string
    document?: string
    email?: string
    phone?: string
  }

  vehicle?: {
    id: number
    model: string
    licensePlate?: string
    brand?: string
    category?: string
  }
}

function RentalDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [rental, setRental] = useState<RentalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        return 'A locação solicitada não foi encontrada.'
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
  // REQUISIÇÕES
  // =========================================================

  useEffect(() => {
    const loadRental = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/v1/rental-orders/${id}`)

        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(getApiErrorMessage(response.status, data))
        }

        const data: RentalDetail = await response.json()
        setRental(data)
      } catch (err) {
        console.error('Erro ao carregar locação:', err)
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadRental()
    }
  }, [id])

  // =========================================================
  // FUNÇÕES AUXILIARES
  // =========================================================

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'

    const [datePart] = dateString.split('T')
    const [year, month, day] = datePart.split('-')

    if (year && month && day) {
      return `${day}/${month}/${year}`
    }

    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) {
      return 'R$ 0,00'
    }

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const renderStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <span className="badge badge-warning">Pendente</span>

      case 'CONFIRMED':
        return <span className="badge badge-info">Confirmada</span>

      case 'ACTIVE':
        return <span className="badge badge-success">Ativa</span>

      case 'COMPLETED':
        return <span className="badge badge-info">Concluída</span>

      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelada</span>

      default:
        return <span className="badge badge-neutral">{status || '—'}</span>
    }
  }

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="page-wrapper">
      <main className="rentals-page">
        <header className="rentals-header">
          <div>
            <span className="page-label">FLEETGO</span>
            <h1>Detalhes da Locação #{id}</h1>
            <p>Visualização das informações da locação.</p>
          </div>

          <div className="rental-details-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/rentals')}
            >
              ← Voltar
            </button>

            <Link
              to={`/rentals/${id}/edit`}
              className="btn-primary"
            >
              Editar Locação
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>Carregando informações...</span>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => navigate('/rentals')}
              className="retry-button"
            >
              Voltar para locações
            </button>
          </div>
        ) : rental ? (
          <div className="rental-details-card">
            {/* CLIENTE E VEÍCULO */}
            <div className="details-grid two-cols">
              <div className="details-section">
                <h3 className="details-title">👤 Informações do Cliente</h3>
                <div className="details-content">
                  <p>
                    <strong>Nome:</strong> {rental.customer?.name || '—'}
                  </p>
                  <p>
                    <strong>Documento:</strong> {rental.customer?.document || '—'}
                  </p>
                  <p>
                    <strong>E-mail:</strong> {rental.customer?.email || '—'}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {rental.customer?.phone || '—'}
                  </p>
                </div>
              </div>

              <div className="details-section">
                <h3 className="details-title">🚗 Informações do Veículo</h3>
                <div className="details-content">
                  <p>
                    <strong>Veículo:</strong>{' '}
                    {rental.vehicle?.brand || ''} {rental.vehicle?.model || '—'}
                  </p>
                  <p>
                    <strong>Placa:</strong> {rental.vehicle?.licensePlate || '—'}
                  </p>
                  <p>
                    <strong>Categoria:</strong> {rental.vehicle?.category || '—'}
                  </p>
                </div>
              </div>
            </div>

            <hr className="details-divider" />

            {/* DATAS E STATUS */}
            <div className="details-grid three-cols">
              <div className="details-section">
                <h3 className="details-title">📅 Retirada</h3>
                <p className="details-value">{formatDate(rental.startDate)}</p>
              </div>

              <div className="details-section">
                <h3 className="details-title">📅 Devolução</h3>
                <p className="details-value">{formatDate(rental.endDate)}</p>
              </div>

              <div className="details-section">
                <h3 className="details-title">📌 Status</h3>
                <div className="details-value">{renderStatus(rental.status)}</div>
              </div>
            </div>

            {/* PAGAMENTO */}
            <div className="details-grid two-cols">
              <div className="details-section">
                <h3 className="details-title">💳 Pagamento</h3>
                <p className="details-value">{rental.paymentMethod || '—'}</p>
              </div>

              <div className="details-section">
                <h3 className="details-title">📊 Status do Pagamento</h3>
                <p className="details-value">{rental.paymentStatus || '—'}</p>
              </div>
            </div>

            {/* VALOR TOTAL */}
            {rental.totalAmount !== undefined && rental.totalAmount !== null && (
              <>
                <hr className="details-divider" />
                <div className="details-total">
                  <span className="total-label">Valor Total</span>
                  <span className="total-value">{formatCurrency(rental.totalAmount)}</span>
                </div>
              </>
            )}
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default RentalDetails