import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const API_URL = 'https://fleetgo-5yk4.onrender.com'

interface DashboardStats {
  customers: number
  vehicles: number
  rentals: number
  employees: number
  activeRentals: number
  availableVehicles: number
}

interface RecentActivity {
  id: string | number
  type: 'rental' | 'customer' | 'vehicle' | 'return'
  title: string
  description: string
  time: string
  status?: string
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    vehicles: 0,
    rentals: 0,
    employees: 0,
    activeRentals: 0,
    availableVehicles: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  const getCreationDate = (obj: any): string => {
    if (!obj) return new Date().toISOString()

    const fields = [
      'createdAt',
      'createdDate',
      'creationDate',
      'createdAtDate',
      'dateCreated',
      'registrationDate',
      'registerDate',
      'created',
      'createdDateTime',
      'createdAtDateTime',
      'timestamp',
    ]

    for (const field of fields) {
      if (obj[field]) {
        const value = obj[field]

        if (typeof value === 'string' || typeof value === 'number') {
          const date = new Date(value)

          if (!Number.isNaN(date.getTime())) {
            return date.toISOString()
          }
        }
      }
    }

    if (obj.vehicle) return getCreationDate(obj.vehicle)
    if (obj.customer) return getCreationDate(obj.customer)
    if (obj.data) return getCreationDate(obj.data)

    return new Date().toISOString()
  }

  const getVehicleName = (vehicle: any): string => {
    if (!vehicle) return ''

    if (vehicle.name) return vehicle.name

    if (vehicle.brand && vehicle.model) {
      return `${vehicle.brand} ${vehicle.model}`
    }

    if (vehicle.brand) return vehicle.brand
    if (vehicle.model) return vehicle.model
    if (vehicle.vehicleName) return vehicle.vehicleName
    if (vehicle.fullName) return vehicle.fullName
    if (vehicle.title) return vehicle.title

    if (vehicle.vehicle) {
      return getVehicleName(vehicle.vehicle)
    }

    if (vehicle.car) {
      return getVehicleName(vehicle.car)
    }

    return ''
  }

  const getCustomerName = (customer: any): string => {
    if (!customer) return ''

    if (customer.name) return customer.name
    if (customer.fullName) return customer.fullName
    if (customer.customerName) return customer.customerName

    if (customer.firstName) {
      const lastName = customer.lastName || customer.surname || ''

      return lastName
        ? `${customer.firstName} ${lastName}`
        : customer.firstName
    }

    if (customer.username) return customer.username

    if (customer.email) {
      return customer.email.split('@')[0]
    }

    if (customer.customer) {
      return getCustomerName(customer.customer)
    }

    return ''
  }

  const getPlate = (vehicle: any): string => {
    if (!vehicle) return ''

    return (
      vehicle.licensePlate ||
      vehicle.plate ||
      vehicle.placa ||
      vehicle.registrationNumber ||
      ''
    )
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)

      if (Number.isNaN(date.getTime())) {
        return 'Data desconhecida'
      }

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return 'Data desconhecida'
    }
  }

  const getActivityColor = (type: RecentActivity['type']): string => {
    switch (type) {
      case 'rental':
        return 'blue'

      case 'return':
        return 'red'

      case 'customer':
        return 'yellow'

      case 'vehicle':
        return 'green'

      default:
        return 'gray'
    }
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          customersResponse,
          vehiclesResponse,
          rentalsResponse,
          employeesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/v1/customers`),
          fetch(`${API_URL}/v1/vehicles`),
          fetch(`${API_URL}/v1/rental-orders`),
          fetch(`${API_URL}/v1/employees`),
        ])

        if (
          !customersResponse.ok ||
          !vehiclesResponse.ok ||
          !rentalsResponse.ok ||
          !employeesResponse.ok
        ) {
          throw new Error('Erro ao carregar estatísticas')
        }

        const customersData = await customersResponse.json()
        const vehiclesData = await vehiclesResponse.json()
        const rentalsData = await rentalsResponse.json()
        const employeesData = await employeesResponse.json()

        const customers = Array.isArray(customersData)
          ? customersData
          : customersData.content ||
            customersData._embedded?.customers ||
            []

        const vehicles = Array.isArray(vehiclesData)
          ? vehiclesData
          : vehiclesData.content ||
            vehiclesData._embedded?.vehicles ||
            []

        const rentals = Array.isArray(rentalsData)
          ? rentalsData
          : rentalsData.content ||
            rentalsData._embedded?.rentalOrders ||
            []

        const employees = Array.isArray(employeesData)
          ? employeesData
          : employeesData.content ||
            employeesData._embedded?.employees ||
            []

        const activeRentals = rentals.filter(
          (rental: any) =>
            rental.status?.toUpperCase() === 'ACTIVE' ||
            rental.status?.toUpperCase() === 'PENDING',
        ).length

        const availableVehicles = vehicles.filter(
          (vehicle: any) =>
            vehicle.status?.toUpperCase() === 'AVAILABLE',
        ).length

        setStats({
          customers: customers.length,
          vehicles: vehicles.length,
          rentals: rentals.length,
          employees: employees.length,
          activeRentals,
          availableVehicles,
        })

        const activities: RecentActivity[] = []

        const sortedRentals = [...rentals]
          .sort((a: any, b: any) => {
            const dateA = new Date(getCreationDate(a)).getTime()
            const dateB = new Date(getCreationDate(b)).getTime()

            return dateB - dateA
          })
          .slice(0, 3)

        sortedRentals.forEach((rental: any) => {
          const status = rental.status?.toUpperCase() || ''

          const isActive =
            status === 'ACTIVE' || status === 'PENDING'

          const vehicle = rental.vehicle || rental.car || {}

          const vehicleName = getVehicleName(vehicle)
          const plate = getPlate(vehicle)

          let description = `Locação #${rental.id || '??'}`

          if (vehicleName) {
            description += ` - ${vehicleName}`
          }

          if (plate) {
            description += ` (${plate})`
          }

          activities.push({
            id: `rental-${rental.id || rental.rentalId || Date.now()}`,
            type: isActive ? 'rental' : 'return',
            title: isActive
              ? 'Nova locação'
              : 'Locação finalizada',
            description,
            time: getCreationDate(rental),
            status: rental.status,
          })
        })

        const sortedCustomers = [...customers]
          .sort((a: any, b: any) => {
            const dateA = new Date(getCreationDate(a)).getTime()
            const dateB = new Date(getCreationDate(b)).getTime()

            return dateB - dateA
          })
          .slice(0, 2)

        sortedCustomers.forEach((customer: any) => {
          const customerName = getCustomerName(customer)

          activities.push({
            id: `customer-${customer.id || Date.now()}`,
            type: 'customer',
            title: 'Cliente cadastrado',
            description: customerName || 'Cliente',
            time: getCreationDate(customer),
          })
        })

        const sortedVehicles = [...vehicles]
          .filter(
            (vehicle: any) =>
              vehicle.status?.toUpperCase() === 'AVAILABLE',
          )
          .sort((a: any, b: any) => {
            const dateA = new Date(getCreationDate(a)).getTime()
            const dateB = new Date(getCreationDate(b)).getTime()

            return dateB - dateA
          })
          .slice(0, 2)

        sortedVehicles.forEach((vehicle: any) => {
          const vehicleName = getVehicleName(vehicle)
          const plate = getPlate(vehicle)

          let description = vehicleName || 'Veículo disponível'

          if (plate) {
            description += ` - ${plate}`
          }

          activities.push({
            id: `vehicle-${vehicle.id || Date.now()}`,
            type: 'vehicle',
            title: 'Veículo disponível',
            description,
            time: getCreationDate(vehicle),
          })
        })

        const sortedEmployees = [...employees]
          .sort((a: any, b: any) => {
            const dateA = new Date(getCreationDate(a)).getTime()
            const dateB = new Date(getCreationDate(b)).getTime()

            return dateB - dateA
          })
          .slice(0, 1)

        sortedEmployees.forEach((employee: any) => {
          const name =
            employee.name ||
            employee.fullName ||
            employee.employeeName ||
            ''

          activities.push({
            id: `employee-${employee.id || Date.now()}`,
            type: 'customer',
            title: 'Funcionário cadastrado',
            description: name || 'Funcionário',
            time: getCreationDate(employee),
          })
        })

        const sortedActivities = activities
          .sort(
            (a, b) =>
              new Date(b.time).getTime() -
              new Date(a.time).getTime(),
          )
          .slice(0, 5)

        setRecentActivities(sortedActivities)
      } catch (err) {
        console.error(
          'Erro ao carregar estatísticas:',
          err,
        )

        setError(
          'Não foi possível carregar as estatísticas.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const total =
    stats.customers +
      stats.vehicles +
      stats.rentals +
      stats.employees || 1

  const chartData = [
    {
      label: 'Clientes',
      value: stats.customers,
      percent: Math.round(
        (stats.customers / total) * 100,
      ),
      color: '#3b82f6',
    },
    {
      label: 'Veículos',
      value: stats.vehicles,
      percent: Math.round(
        (stats.vehicles / total) * 100,
      ),
      color: '#22c55e',
    },
    {
      label: 'Locações',
      value: stats.rentals,
      percent: Math.round(
        (stats.rentals / total) * 100,
      ),
      color: '#eab308',
    },
    {
      label: 'Funcionários',
      value: stats.employees,
      percent: Math.round(
        (stats.employees / total) * 100,
      ),
      color: '#8b5cf6',
    },
  ]

  return (
    <div className="page-wrapper">
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <span className="page-label">FLEETGO</span>

            <h1>Dashboard</h1>

            <p>
              Visão geral do sistema de locação de veículos.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner" />

            <span>
              Carregando estatísticas...
            </span>
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <section className="dashboard-chart">
              <h2>Distribuição do Sistema</h2>

              <div className="chart-container">
                {chartData.map((item) => (
                  <div
                    key={item.label}
                    className="chart-bar-item"
                  >
                    <span className="chart-bar-label">
                      {item.label}
                    </span>

                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{
                          width: `${item.percent}%`,
                          background: item.color,
                        }}
                      >
                        <span className="chart-bar-value">
                          {item.value}
                        </span>
                      </div>
                    </div>

                    <span className="chart-bar-percent">
                      {item.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-stats-grid">
              <div className="stat-card stat-card-blue">
                <div className="stat-header">
                  <span className="stat-title">
                    Clientes
                  </span>

                  <span className="stat-icon">
                    👥
                  </span>
                </div>

                <div className="stat-value">
                  {stats.customers}
                </div>

                <div className="stat-trend positive">
                  +5 este mês
                </div>
              </div>

              <div className="stat-card stat-card-green">
                <div className="stat-header">
                  <span className="stat-title">
                    Veículos
                  </span>

                  <span className="stat-icon">
                    🚗
                  </span>
                </div>

                <div className="stat-value">
                  {stats.vehicles}
                </div>

                <div className="stat-trend positive">
                  {stats.availableVehicles} disponíveis
                </div>
              </div>

              <div className="stat-card stat-card-yellow">
                <div className="stat-header">
                  <span className="stat-title">
                    Locações
                  </span>

                  <span className="stat-icon">
                    📋
                  </span>
                </div>

                <div className="stat-value">
                  {stats.rentals}
                </div>

                <div className="stat-trend positive">
                  {stats.activeRentals} ativas
                </div>
              </div>

              <div className="stat-card stat-card-purple">
                <div className="stat-header">
                  <span className="stat-title">
                    Funcionários
                  </span>

                  <span className="stat-icon">
                    👔
                  </span>
                </div>

                <div className="stat-value">
                  {stats.employees}
                </div>

                <div className="stat-trend positive">
                  +2 este mês
                </div>
              </div>
            </section>

            <section className="dashboard-quick-actions">
              <h2>Ações Rápidas</h2>

              <div className="quick-actions-grid">
                <Link
                  to="/customers/new"
                  className="quick-action-card"
                >
                  <span className="quick-icon">
                    👤
                  </span>

                  <span className="quick-label">
                    Novo Cliente
                  </span>
                </Link>

                <Link
                  to="/vehicles/new"
                  className="quick-action-card"
                >
                  <span className="quick-icon">
                    🚗
                  </span>

                  <span className="quick-label">
                    Novo Veículo
                  </span>
                </Link>

                <Link
                  to="/rentals/new"
                  className="quick-action-card"
                >
                  <span className="quick-icon">
                    📋
                  </span>

                  <span className="quick-label">
                    Nova Locação
                  </span>
                </Link>

                <Link
                  to="/employees/new"
                  className="quick-action-card"
                >
                  <span className="quick-icon">
                    👔
                  </span>

                  <span className="quick-label">
                    Novo Funcionário
                  </span>
                </Link>
              </div>
            </section>

            <section className="dashboard-recent">
              <h2>Atividades Recentes</h2>

              <div className="recent-activities-card">
                {recentActivities.length === 0 ? (
                  <div className="activity-empty">
                    <span>
                      Nenhuma atividade recente
                      encontrada.
                    </span>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="activity-item"
                    >
                      <span
                        className={`activity-dot ${getActivityColor(
                          activity.type,
                        )}`}
                      />

                      <div className="activity-content">
                        <span className="activity-text">
                          {activity.title}
                        </span>

                        <span className="activity-description">
                          {activity.description}
                        </span>

                        <span className="activity-time">
                          {formatDate(activity.time)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard