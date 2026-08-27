import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './Rentals.css'

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

function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [customers, setCustomers] = useState<Record<number, Customer>>({})
  const [vehicles, setVehicles] = useState<Record<number, Vehicle>>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        // Busca locações
        const rentalsResponse = await fetch(
          'http://localhost:8085/v1/rental-orders'
        )

        if (!rentalsResponse.ok) {
          throw new Error('Erro ao buscar locações')
        }

        const rentalsData = await rentalsResponse.json()

        const rentalList: Rental[] = Array.isArray(rentalsData)
          ? rentalsData
          : rentalsData.content || []

        setRentals(rentalList)

        // Busca clientes
        const customersResponse = await fetch(
          'http://localhost:8085/v1/customers'
        )

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

        // Busca veículos
        const vehiclesResponse = await fetch(
          'http://localhost:8085/v1/vehicles'
        )

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
        setError('Não foi possível carregar as locações.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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

  const renderStatus = (status: string) => {
    const normalizedStatus = status?.toUpperCase()

    switch (normalizedStatus) {
      case 'PENDING':
      case 'PENDENTE':
        return (
          <span className="badge badge-warning">
            Pendente
          </span>
        )

      case 'CONFIRMED':
      case 'CONFIRMADA':
        return (
          <span className="badge badge-info">
            Confirmada
          </span>
        )

      case 'ACTIVE':
      case 'ATIVA':
      case 'IN_PROGRESS':
        return (
          <span className="badge badge-success">
            Ativa
          </span>
        )

      case 'COMPLETED':
      case 'CONCLUIDA':
      case 'FINISHED':
        return (
          <span className="badge badge-info">
            Concluída
          </span>
        )

      case 'CANCELLED':
      case 'CANCELADA':
        return (
          <span className="badge badge-danger">
            Cancelada
          </span>
        )

      default:
        return (
          <span className="badge badge-neutral">
            {status || '—'}
          </span>
        )
    }
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

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="rentals-page">

        <header className="rentals-header">
          <div>
            <h1>Gerenciamento de Locações</h1>

            <p>
              Acompanhe e gerencie todos os contratos
              ativos e encerrados.
            </p>
          </div>

          <Link
            to="/rentals/new"
            className="new-rental-button"
          >
            + Nova Locação
          </Link>
        </header>

        {loading && (
          <div className="loading-state">
            <p>Carregando locações...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="table-container">

            <table className="rentals-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Veículo</th>
                  <th>Data Retirada</th>
                  <th>Data Devolução</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {rentals.length === 0 ? (

                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: 'center',
                        padding: '24px',
                      }}
                    >
                      Nenhuma locação encontrada.
                    </td>
                  </tr>

                ) : (

                  rentals.map((rental) => (

                    <tr key={rental.id}>

                      <td>
                        #{rental.id}
                      </td>

                      <td>
                        {getCustomerName(rental.customerId)}
                      </td>

                      <td>
                        {getVehicleName(rental.vehicleId)}
                      </td>

                      <td>
                        {formatDate(rental.startDate)}
                      </td>

                      <td>
                        {formatDate(rental.endDate)}
                      </td>

                      <td>
                        {renderStatus(rental.status)}
                      </td>

                      <td>
                        <div className="actions-cell">

                          <Link
                            to={`/rentals/${rental.id}`}
                            className="action-btn view-btn"
                          >
                            Detalhes
                          </Link>

                          <Link
                            to={`/rentals/${rental.id}/edit`}
                            className="action-btn edit-btn"
                          >
                            Editar
                          </Link>

                        </div>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>
        )}

      </main>
    </div>
  )
}

export default Rentals