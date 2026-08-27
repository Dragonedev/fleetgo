import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './Vehicles.css'

interface Vehicle {
  id: number
  brand: string
  model: string
  licensePlate: string
  year: number
  mileage: number
  dailyRate: number
  status: string
}

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8085/v1/vehicles')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar veículos')
        }
        return response.json()
      })
      .then((data) => {
        setVehicles(data.content || [])
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este veículo?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8085/v1/vehicles/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir veículo')
      }

      setVehicles((currentVehicles) =>
        currentVehicles.filter((vehicle) => vehicle.id !== id)
      )
    } catch (error) {
      console.error(error)
      alert('Não foi possível excluir o veículo.')
    }
  }

  const renderStatusBadge = (status: string) => {
    const statusNormalized = status?.toUpperCase() || ''

    if (statusNormalized === 'DISPONIVEL' || statusNormalized === 'AVAILABLE') {
      return <span className="badge badge-success">Disponível</span>
    }
    if (statusNormalized === 'ALUGADO' || statusNormalized === 'RENTED') {
      return <span className="badge badge-warning">Alugado</span>
    }
    if (statusNormalized === 'MANUTENCAO' || statusNormalized === 'MAINTENANCE') {
      return <span className="badge badge-danger">Manutenção</span>
    }

    return <span className="badge badge-neutral">{status}</span>
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="vehicles-page">
        <header className="vehicles-header">
          <div>
            <h1>Frota de Veículos</h1>
            <p>Gerencie a frota disponível para locação no sistema.</p>
          </div>

          <Link to="/vehicles/new" className="new-vehicle-button">
            + Novo Veículo
          </Link>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Carregando catálogo de veículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum veículo encontrado na frota.</p>
            <Link to="/vehicles/new" className="button-link">
              Cadastrar o primeiro veículo
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Marca / Modelo</th>
                  <th>Placa</th>
                  <th>Ano</th>
                  <th>Diária</th>
                  <th>Status</th>
                  <th className="actions-header">Ações</th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <div className="vehicle-info">
                        <span className="vehicle-model">{vehicle.model}</span>
                        <span className="vehicle-brand">{vehicle.brand}</span>
                      </div>
                    </td>
                    <td>
                      <span className="plate-badge">{vehicle.licensePlate}</span>
                    </td>
                    <td>{vehicle.year}</td>
                    <td className="daily-rate">
                      R$ {vehicle.dailyRate.toFixed(2)}
                    </td>
                    <td>{renderStatusBadge(vehicle.status)}</td>

                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/vehicles/${vehicle.id}/edit`}
                          className="action-btn edit-btn"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default Vehicles