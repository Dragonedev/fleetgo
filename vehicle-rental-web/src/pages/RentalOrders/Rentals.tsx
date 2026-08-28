import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import './Rentals.css'

// =========================================================
// TIPOS E INTERFACES
// =========================================================

const API_URL = '${import.meta.env.VITE_API_URL}'

interface Rental {
  id: number
  startDate: string
  endDate: string
  status: string
  totalAmount?: number
  paymentMethod?: string
  paymentStatus?: string
  customerId: number
  vehicleId: number
  employeeId: number
}

interface Customer {
  id: number
  name: string
}

interface Vehicle {
  id: number
  brand: string
  model: string
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

function Rentals() {
  // =========================================================
  // STATES
  // =========================================================

  const [rentals, setRentals] = useState<Rental[]>([])
  const [customers, setCustomers] = useState<Record<number, Customer>>({})
  const [vehicles, setVehicles] = useState<Record<number, Vehicle>>({})
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

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return '-'
    }

    const [datePart] = dateString.split('T')
    const [year, month, day] = datePart.split('-')

    if (year && month && day) {
      return `${day}/${month}/${year}`
    }

    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getCustomerName = (customerId: number) => {
    return customers[customerId]?.name || `Cliente #${customerId}`
  }

  const getVehicleName = (vehicleId: number) => {
    const vehicle = vehicles[vehicleId]

    if (!vehicle) {
      return `Veículo #${vehicleId}`
    }

    return `${vehicle.brand} ${vehicle.model}`
  }

  // =========================================================
  // REQUISIÇÕES
  // =========================================================

  const loadRentals = async () => {
    try {
      setLoading(true)
      setError('')

      const [rentalsResponse, customersResponse, vehiclesResponse] = await Promise.all([
        fetch(`${API_URL}/v1/rental-orders`),
        fetch(`${API_URL}/v1/customers`),
        fetch(`${API_URL}/v1/vehicles`),
      ])

      if (!rentalsResponse.ok) {
        const data = await rentalsResponse.json().catch(() => null)
        throw new Error(getApiErrorMessage(rentalsResponse.status, data))
      }

      const rentalsData = await rentalsResponse.json()
      const rentalList: Rental[] = Array.isArray(rentalsData)
        ? rentalsData
        : rentalsData.content || []

      setRentals(rentalList)

      if (customersResponse.ok) {
        const customersData = await customersResponse.json()
        const customerList: Customer[] = Array.isArray(customersData)
          ? customersData
          : customersData.content || []

        const customerMap: Record<number, Customer> = {}
        customerList.forEach((customer) => {
          customerMap[customer.id] = customer
        })

        setCustomers(customerMap)
      }

      if (vehiclesResponse.ok) {
        const vehiclesData = await vehiclesResponse.json()
        const vehicleList: Vehicle[] = Array.isArray(vehiclesData)
          ? vehiclesData
          : vehiclesData.content || []

        const vehicleMap: Record<number, Vehicle> = {}
        vehicleList.forEach((vehicle) => {
          vehicleMap[vehicle.id] = vehicle
        })

        setVehicles(vehicleMap)
      }
    } catch (err) {
      console.error('Erro ao carregar locações:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRentals()
  }, [])

  // =========================================================
  // RENDER - STATUS
  // =========================================================

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

            <h1>Locações</h1>

            <p>
              Acompanhe e gerencie todos os contratos ativos e encerrados.
            </p>
          </div>

          <Link to="/rentals/new" className="new-rental-button">
            <span>+</span>
            Nova Locação
          </Link>
        </header>

        <section className="rentals-card">
          <div className="rentals-card-header">
            <div>
              <h2>Locações cadastradas</h2>

              <p>
                Visualize e gerencie todos os contratos de aluguel.
              </p>
            </div>

            <span className="rental-count">
              {rentals.length} {rentals.length === 1 ? 'locação' : 'locações'}
            </span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <span>Carregando locações...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>

                <button
                  type="button"
                  onClick={loadRentals}
                  className="retry-button"
                >
                  Tentar novamente
                </button>
              </div>
            ) : rentals.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma locação cadastrada.</p>

                <Link to="/rentals/new" className="empty-state-link">
                  Cadastrar primeira locação
                </Link>
              </div>
            ) : (
              <table className="rentals-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Veículo</th>
                    <th>Retirada</th>
                    <th>Devolução</th>
                    <th>Status</th>
                    <th className="actions-column">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td>
                        <span className="rental-id">#{rental.id}</span>
                      </td>

                      <td>
                        <div className="rental-customer">
                          <span className="customer-name">
                            {getCustomerName(rental.customerId)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="rental-vehicle">
                          <span className="vehicle-model">
                            {getVehicleName(rental.vehicleId)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="rental-date">
                          {formatDate(rental.startDate)}
                        </span>
                      </td>

                      <td>
                        <span className="rental-date">
                          {formatDate(rental.endDate)}
                        </span>
                      </td>

                      <td>{renderStatus(rental.status)}</td>

                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/rentals/${rental.id}`}
                            className="action-button"
                          >
                            Detalhes
                          </Link>

                          <Link
                            to={`/rentals/${rental.id}/edit`}
                            className="action-button"
                          >
                            Editar
                          </Link>
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
    </div>
  )
}

export default Rentals