import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './Rentals.css'

interface RentalDetail {
  id: number
  customerName?: string
  vehicleModel?: string
  customer?: { name: string; document?: string; email?: string; phone?: string }
  vehicle?: { model: string; licensePlate?: string; brand?: string; category?: string }
  startDate: string
  endDate: string
  status: string
  totalValue?: number
}

function RentalDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rental, setRental] = useState<RentalDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8085/v1/rentals/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao carregar detalhes da locação')
        }
        return response.json()
      })
      .then((data) => setRental(data))
      .catch((error) => console.error('Erro na requisição:', error))
      .finally(() => setLoading(false))
  }, [id])

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
    if (value === undefined || value === null) return 'R$ 0,00'
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="rentals-page">
        <header className="rentals-header">
          <div>
            <h1>Detalhes da Locação #{id}</h1>
            <p>Visualização das informações consolidadas da reserva.</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="action-btn"
              onClick={() => navigate('/rentals')}
            >
              Voltar
            </button>
            <Link to={`/rentals/${id}/edit`} className="new-rental-button">
              Editar Locação
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <p>Carregando informações...</p>
          </div>
        ) : !rental ? (
          <div className="table-container" style={{ padding: '24px', textAlign: 'center' }}>
            <p>Locação não encontrada ou erro ao carregar dados.</p>
            <Link to="/rentals" className="action-btn" style={{ marginTop: '12px', display: 'inline-block' }}>
              Voltar para a lista
            </Link>
          </div>
        ) : (
          <div className="table-container" style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ marginBottom: '12px', color: '#172033' }}>Informações do Cliente</h3>
                <p><strong>Nome:</strong> {rental.customerName || rental.customer?.name || '—'}</p>
                <p><strong>Documento:</strong> {rental.customer?.document || '—'}</p>
                <p><strong>Contato:</strong> {rental.customer?.phone || rental.customer?.email || '—'}</p>
              </div>

              <div>
                <h3 style={{ marginBottom: '12px', color: '#172033' }}>Informações do Veículo</h3>
                <p><strong>Modelo:</strong> {rental.vehicleModel || rental.vehicle?.model || '—'}</p>
                <p><strong>Placa:</strong> {rental.vehicle?.licensePlate || '—'}</p>
                <p><strong>Marca:</strong> {rental.vehicle?.brand || '—'}</p>
              </div>
            </div>

            <hr style={{ margin: '24px 0', borderColor: '#e2e8f0', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div>
                <p><strong>Retirada:</strong></p>
                <p>{formatDate(rental.startDate)}</p>
              </div>

              <div>
                <p><strong>Devolução:</strong></p>
                <p>{formatDate(rental.endDate)}</p>
              </div>

              <div>
                <p><strong>Status Atual:</strong></p>
                <p><span className="badge badge-neutral">{rental.status}</span></p>
              </div>
            </div>

            {rental.totalValue !== undefined && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '18px', fontWeight: 600 }}>
                  Valor Total: <span style={{ color: '#16a34a' }}>{formatCurrency(rental.totalValue)}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default RentalDetails