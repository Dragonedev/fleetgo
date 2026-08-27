import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './Rentals.css'

interface Rental {
  id: number
  customerName: string
  vehicleModel: string
  startDate: string
  endDate: string
  status: string
  totalValue?: number
}

function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8085/v1/rentals')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar locações')
        }
        return response.json()
      })
      .then((data) => {
        setRentals(data.content || data || [])
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleCancelRental = async (id: number) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar esta locação?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8085/v1/rentals/${id}/cancel`,
        {
          method: 'PATCH',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao cancelar locação')
      }

      setRentals((currentRentals) =>
        currentRentals.map((rental) =>
          rental.id === id ? { ...rental, status: 'CANCELLED' } : rental
        )
      )
    } catch (error) {
      console.error(error)
      alert('Não foi possível cancelar a locação.')
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString('pt-BR')
  }

  const renderStatusBadge = (status: string) => {
    const statusNormalized = status?.toUpperCase() || ''

    if (statusNormalized === 'ATIVA' || statusNormalized === 'ACTIVE') {
      return <span className="badge badge-success">Ativa</span>
    }
    if (statusNormalized === 'CONCLUIDA' || statusNormalized === 'COMPLETED') {
      return <span className="badge badge-info">Concluída</span>
    }
    if (statusNormalized === 'CANCELADA' || statusNormalized === 'CANCELLED') {
      return <span className="badge badge-danger">Cancelada</span>
    }
    if (statusNormalized === 'ATRASADA' || statusNormalized === 'OVERDUE') {
      return <span className="badge badge-warning">Atrasada</span>
    }

    return <span className="badge badge-neutral">{status}</span>
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="rentals-page">
        <header className="rentals-header">
          <div>
            <h1>Gestão de Locações</h1>
            <p>Acompanhe o histórico e o status das locações de veículos.</p>
          </div>

          <Link to="/rentals/new" className="new-rental-button">
            + Nova Locação
          </Link>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Carregando locações...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma locação registrada no momento.</p>
            <Link to="/rentals/new" className="button-link">
              Criar a primeira locação
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="rentals-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Veículo</th>
                  <th>Data de Retirada</th>
                  <th>Data de Devolução</th>
                  <th>Status</th>
                  <th className="actions-header">Ações</th>
                </tr>
              </thead>

              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td>
                      <span className="customer-name">{rental.customerName}</span>
                    </td>
                    <td>
                      <span className="vehicle-model">{rental.vehicleModel}</span>
                    </td>
                    <td>{formatDate(rental.startDate)}</td>
                    <td>{formatDate(rental.endDate)}</td>
                    <td>{renderStatusBadge(rental.status)}</td>

                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/rentals/${rental.id}`}
                          className="action-btn view-btn"
                        >
                          Detalhes
                        </Link>

                        {(rental.status?.toUpperCase() === 'ACTIVE' ||
                          rental.status?.toUpperCase() === 'ATIVA') && (
                          <button
                            type="button"
                            className="action-btn cancel-btn"
                            onClick={() => handleCancelRental(rental.id)}
                          >
                            Cancelar
                          </button>
                        )}
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

export default Rentals