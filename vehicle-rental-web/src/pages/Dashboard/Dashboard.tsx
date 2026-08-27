import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const API_URL = 'http://localhost:8085'

interface DashboardStats {
  customers: number
  vehicles: number
  rentals: number
  employees: number
  activeRentals: number
  availableVehicles: number
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError('')

        // Buscar dados de todas as entidades
        const [customersRes, vehiclesRes, rentalsRes, employeesRes] = await Promise.all([
          fetch(`${API_URL}/v1/customers`),
          fetch(`${API_URL}/v1/vehicles`),
          fetch(`${API_URL}/v1/rental-orders`),
          fetch(`${API_URL}/v1/employees`),
        ])

        if (!customersRes.ok || !vehiclesRes.ok || !rentalsRes.ok || !employeesRes.ok) {
          throw new Error('Erro ao carregar estatísticas')
        }

        const customersData = await customersRes.json()
        const vehiclesData = await vehiclesRes.json()
        const rentalsData = await rentalsRes.json()
        const employeesData = await employeesRes.json()

        // Extrair dados (suporta tanto array direto quanto Page)
        const customers = Array.isArray(customersData) 
          ? customersData 
          : customersData.content || customersData._embedded?.customers || []

        const vehicles = Array.isArray(vehiclesData) 
          ? vehiclesData 
          : vehiclesData.content || vehiclesData._embedded?.vehicles || []

        const rentals = Array.isArray(rentalsData) 
          ? rentalsData 
          : rentalsData.content || rentalsData._embedded?.rentalOrders || []

        const employees = Array.isArray(employeesData) 
          ? employeesData 
          : employeesData.content || employeesData._embedded?.employees || []

        // Calcular métricas
        const activeRentals = rentals.filter(
          (r: any) => r.status?.toUpperCase() === 'ACTIVE' || r.status?.toUpperCase() === 'PENDING'
        ).length

        const availableVehicles = vehicles.filter(
          (v: any) => v.status?.toUpperCase() === 'AVAILABLE'
        ).length

        setStats({
          customers: customers.length,
          vehicles: vehicles.length,
          rentals: rentals.length,
          employees: employees.length,
          activeRentals,
          availableVehicles,
        })
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err)
        setError('Não foi possível carregar as estatísticas.')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="page-wrapper">
      <main className="dashboard-page">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <span className="page-label">FLEETGO</span>
            <h1>Dashboard</h1>
            <p>Visão geral do sistema de locação de veículos.</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/rentals/new" className="dashboard-action-btn primary">
              + Nova Locação
            </Link>
            <Link to="/vehicles/new" className="dashboard-action-btn secondary">
              + Novo Veículo
            </Link>
          </div>
        </header>

        {/* STATS */}
        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner" />
            <span>Carregando estatísticas...</span>
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
            <section className="dashboard-stats-grid">
              <div className="stat-card stat-card-blue">
                <div className="stat-header">
                  <span className="stat-title">Clientes</span>
                  <span className="stat-icon">👥</span>
                </div>
                <div className="stat-value">{stats.customers}</div>
                <div className="stat-trend positive">+5 este mês</div>
              </div>

              <div className="stat-card stat-card-green">
                <div className="stat-header">
                  <span className="stat-title">Veículos</span>
                  <span className="stat-icon">🚗</span>
                </div>
                <div className="stat-value">{stats.vehicles}</div>
                <div className="stat-trend positive">{stats.availableVehicles} disponíveis</div>
              </div>

              <div className="stat-card stat-card-yellow">
                <div className="stat-header">
                  <span className="stat-title">Locações</span>
                  <span className="stat-icon">📋</span>
                </div>
                <div className="stat-value">{stats.rentals}</div>
                <div className="stat-trend positive">{stats.activeRentals} ativas</div>
              </div>

              <div className="stat-card stat-card-purple">
                <div className="stat-header">
                  <span className="stat-title">Funcionários</span>
                  <span className="stat-icon">👔</span>
                </div>
                <div className="stat-value">{stats.employees}</div>
                <div className="stat-trend positive">+2 este mês</div>
              </div>
            </section>

            {/* AÇÕES RÁPIDAS */}
            <section className="dashboard-quick-actions">
              <h2>Ações Rápidas</h2>
              <div className="quick-actions-grid">
                <Link to="/customers/new" className="quick-action-card">
                  <span className="quick-icon">👤</span>
                  <span className="quick-label">Novo Cliente</span>
                </Link>
                <Link to="/vehicles/new" className="quick-action-card">
                  <span className="quick-icon">🚗</span>
                  <span className="quick-label">Novo Veículo</span>
                </Link>
                <Link to="/rentals/new" className="quick-action-card">
                  <span className="quick-icon">📋</span>
                  <span className="quick-label">Nova Locação</span>
                </Link>
                <Link to="/employees/new" className="quick-action-card">
                  <span className="quick-icon">👔</span>
                  <span className="quick-label">Novo Funcionário</span>
                </Link>
              </div>
            </section>

            {/* ÚLTIMAS ATIVIDADES */}
            <section className="dashboard-recent">
              <h2>Atividades Recentes</h2>
              <div className="recent-activities-card">
                <div className="activity-item">
                  <span className="activity-dot blue" />
                  <div className="activity-content">
                    <span className="activity-text">Nova locação criada</span>
                    <span className="activity-time">Há 5 minutos</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-dot green" />
                  <div className="activity-content">
                    <span className="activity-text">Veículo disponível: Toyota Corolla</span>
                    <span className="activity-time">Há 15 minutos</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-dot yellow" />
                  <div className="activity-content">
                    <span className="activity-text">Cliente cadastrado: Maria Silva</span>
                    <span className="activity-time">Há 1 hora</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-dot red" />
                  <div className="activity-content">
                    <span className="activity-text">Locação finalizada: #0042</span>
                    <span className="activity-time">Há 2 horas</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard