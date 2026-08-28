import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './Rentals.css'

interface Customer {
  id: number
  name: string
  document?: string
  email?: string
  phone?: string
}

interface Vehicle {
  id: number
  model: string
  licensePlate?: string
  brand?: string
  category?: string
}

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
  customer?: Customer
  vehicle?: Vehicle
}

function RentalDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [rental, setRental] = useState<RentalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    if (data?.message) return data.message
    if (data?.error) return data.error

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

  const loadRental = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        rentalResponse,
        customersResponse,
        vehiclesResponse,
      ] = await Promise.all([
        fetch(
          `https://fleetgo-5yk4.onrender.com/v1/rental-orders/${id}`,
        ),
        fetch(
          `https://fleetgo-5yk4.onrender.com/v1/customers`,
        ),
        fetch(
          `https://fleetgo-5yk4.onrender.com/v1/vehicles`,
        ),
      ])

      if (!rentalResponse.ok) {
        const data = await rentalResponse.json().catch(() => null)

        throw new Error(
          getApiErrorMessage(rentalResponse.status, data),
        )
      }

      const rentalData: RentalDetail =
        await rentalResponse.json()

      if (customersResponse.ok) {
        const customersData = await customersResponse.json()

        const customerList: Customer[] =
          Array.isArray(customersData)
            ? customersData
            : customersData.content || []

        const customerMap: Record<number, Customer> = {}

        customerList.forEach((customer) => {
          customerMap[customer.id] = customer
        })

        if (
          rentalData.customerId &&
          customerMap[rentalData.customerId]
        ) {
          rentalData.customer =
            customerMap[rentalData.customerId]
        }
      }

      if (vehiclesResponse.ok) {
        const vehiclesData = await vehiclesResponse.json()

        const vehicleList: Vehicle[] =
          Array.isArray(vehiclesData)
            ? vehiclesData
            : vehiclesData.content || []

        const vehicleMap: Record<number, Vehicle> = {}

        vehicleList.forEach((vehicle) => {
          vehicleMap[vehicle.id] = vehicle
        })

        if (
          rentalData.vehicleId &&
          vehicleMap[rentalData.vehicleId]
        ) {
          rentalData.vehicle =
            vehicleMap[rentalData.vehicleId]
        }
      }

      setRental(rentalData)
    } catch (err) {
      console.error('Erro ao buscar locação:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadRental()
    }
  }, [id])

  const formatDate = (
    dateString: string | undefined,
  ): string => {
    if (!dateString) return '-'

    try {
      return new Date(dateString).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      )
    } catch {
      return '-'
    }
  }

  const formatCurrency = (
    value: number | undefined,
  ): string => {
    if (value === undefined || value === null) {
      return 'R$ 0,00'
    }

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const getStatusLabel = (
    status: string | undefined,
  ): string => {
    if (!status) return '—'

    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pendente'
      case 'CONFIRMED':
        return 'Confirmada'
      case 'ACTIVE':
        return 'Ativa'
      case 'COMPLETED':
        return 'Concluída'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getStatusClass = (
    status: string | undefined,
  ): string => {
    if (!status) return 'badge-neutral'

    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'badge-warning'
      case 'CONFIRMED':
        return 'badge-info'
      case 'ACTIVE':
        return 'badge-success'
      case 'COMPLETED':
        return 'badge-info'
      case 'CANCELLED':
        return 'badge-danger'
      default:
        return 'badge-neutral'
    }
  }

  const getPaymentStatusLabel = (
    status: string | undefined,
  ): string => {
    if (!status) return '—'

    switch (status.toUpperCase()) {
      case 'PAID':
        return 'Pago'
      case 'PENDING':
        return 'Pendente'
      case 'OVERDUE':
        return 'Vencido'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getPaymentStatusClass = (
    status: string | undefined,
  ): string => {
    if (!status) return 'badge-neutral'

    switch (status.toUpperCase()) {
      case 'PAID':
        return 'badge-success'
      case 'PENDING':
        return 'badge-warning'
      case 'OVERDUE':
        return 'badge-danger'
      case 'CANCELLED':
        return 'badge-neutral'
      default:
        return 'badge-neutral'
    }
  }

  const getDaysDifference = (
    start: string | undefined,
    end: string | undefined,
  ): string => {
    if (!start || !end) return '—'

    try {
      const startDate = new Date(start)
      const endDate = new Date(end)

      const diffTime = Math.abs(
        endDate.getTime() - startDate.getTime(),
      )

      const diffDays = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24),
      )

      return `${diffDays} ${
        diffDays === 1 ? 'dia' : 'dias'
      }`
    } catch {
      return '—'
    }
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <main className="rentals-page">
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>
              Carregando detalhes da locação...
            </span>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <main className="rentals-page">
          <div className="error-state">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadRental}
              className="retry-button"
            >
              Tentar novamente
            </button>

            <button
              type="button"
              onClick={() => navigate('/rentals')}
              className="retry-button"
              style={{ marginTop: '8px' }}
            >
              Voltar para locações
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!rental) {
    return (
      <div className="page-wrapper">
        <main className="rentals-page">
          <div className="empty-state">
            <p>
              Locação #{id} não encontrada.
            </p>

            <Link
              to="/rentals"
              className="empty-state-link"
            >
              Voltar para locações
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <main className="rentals-page">
        <header className="rentals-header">
          <div>
            <span className="page-label">
              FLEETGO
            </span>

            <h1>
              Detalhes da Locação #{rental.id}
            </h1>

            <p>
              Visualize e gerencie as informações da
              locação.
            </p>
          </div>

          <div className="rental-details-actions">
            <Link
              to="/rentals"
              className="btn-secondary"
            >
              ← Voltar
            </Link>

            <Link
              to={`/rentals/${id}/edit`}
              className="btn-primary"
            >
              Editar
            </Link>
          </div>
        </header>

        <div className="rental-details-card">
          <div className="rentals-card-header">
            <div>
              <h2>
                Informações da Locação
              </h2>

              <p>
                Detalhes completos do contrato de
                locação.
              </p>
            </div>

            <span
              className={`badge ${getStatusClass(
                rental.status,
              )}`}
            >
              {getStatusLabel(rental.status)}
            </span>
          </div>

          <div className="details-grid two-cols">
            <div className="details-section">
              <h3 className="details-title">
                Cliente
              </h3>

              <div className="details-content">
                <p>
                  <strong>Nome:</strong>{' '}
                  {rental.customer?.name ||
                    `Cliente #${rental.customerId}`}
                </p>

                <p>
                  <strong>Documento:</strong>{' '}
                  {rental.customer?.document || '—'}
                </p>

                <p>
                  <strong>E-mail:</strong>{' '}
                  {rental.customer?.email || '—'}
                </p>

                <p>
                  <strong>Telefone:</strong>{' '}
                  {rental.customer?.phone || '—'}
                </p>
              </div>
            </div>

            <div className="details-section">
              <h3 className="details-title">
                Veículo
              </h3>

              <div className="details-content">
                <p>
                  <strong>Veículo:</strong>{' '}
                  {rental.vehicle?.brand || ''}{' '}
                  {rental.vehicle?.model ||
                    `Veículo #${rental.vehicleId}`}
                </p>

                <p>
                  <strong>Placa:</strong>{' '}
                  {rental.vehicle?.licensePlate || '—'}
                </p>
              </div>
            </div>
          </div>

          <hr className="details-divider" />

          <div className="details-grid three-cols">
            <div className="details-section">
              <h3 className="details-title">
                Retirada
              </h3>

              <p className="details-value">
                {formatDate(rental.startDate)}
              </p>
            </div>

            <div className="details-section">
              <h3 className="details-title">
                Devolução
              </h3>

              <p className="details-value">
                {formatDate(rental.endDate)}
              </p>
            </div>

            <div className="details-section">
              <h3 className="details-title">
                Duração
              </h3>

              <p className="details-value">
                {getDaysDifference(
                  rental.startDate,
                  rental.endDate,
                )}
              </p>
            </div>
          </div>

          <hr className="details-divider" />

          <div className="details-grid two-cols">
            <div className="details-section">
              <h3 className="details-title">
                Método de Pagamento
              </h3>

              <p className="details-value">
                {rental.paymentMethod || '—'}
              </p>
            </div>

            <div className="details-section">
              <h3 className="details-title">
                Status do Pagamento
              </h3>

              <p className="details-value">
                <span
                  className={`badge ${getPaymentStatusClass(
                    rental.paymentStatus,
                  )}`}
                >
                  {getPaymentStatusLabel(
                    rental.paymentStatus,
                  )}
                </span>
              </p>
            </div>
          </div>

          {rental.totalAmount !== undefined &&
            rental.totalAmount !== null && (
              <>
                <hr className="details-divider" />

                <div className="details-total">
                  <span className="total-label">
                    Valor Total
                  </span>

                  <span className="total-value">
                    {formatCurrency(
                      rental.totalAmount,
                    )}
                  </span>
                </div>
              </>
            )}
        </div>
      </main>
    </div>
  )
}

export default RentalDetails