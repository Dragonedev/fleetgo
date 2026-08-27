import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

interface Entity {
  id: number
  name?: string
  model?: string
  brand?: string
}

function RentalEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customerId, setCustomerId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [customers, setCustomers] = useState<Entity[]>([])
  const [vehicles, setVehicles] = useState<Entity[]>([])
  const [employees, setEmployees] = useState<Entity[]>([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8085/v1/customers').then((res) => res.json()),
      fetch('http://localhost:8085/v1/vehicles').then((res) => res.json()),
      fetch('http://localhost:8085/v1/employees').then((res) => res.json()),
      fetch(`http://localhost:8085/v1/rentals/${id}`).then((res) => res.json()),
    ])
      .then(([custData, vehData, empData, rentalData]) => {
        setCustomers(custData)
        setVehicles(vehData)
        setEmployees(empData)

        setCustomerId(rentalData.customerId || rentalData.customer?.id || '')
        setVehicleId(rentalData.vehicleId || rentalData.vehicle?.id || '')
        setEmployeeId(rentalData.employeeId || rentalData.employee?.id || '')
        setStartDate(rentalData.startDate || '')
        setEndDate(rentalData.endDate || '')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    const payload = {
      customerId: Number(customerId),
      vehicleId: Number(vehicleId),
      employeeId: Number(employeeId),
      startDate,
      endDate,
    }

    try {
      const response = await fetch(`http://localhost:8085/v1/rentals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Erro ao atualizar aluguel')

      alert('Aluguel atualizado com sucesso!')
      navigate('/rentals')
    } catch (error) {
      console.error(error)
      alert('Não foi possível atualizar o aluguel.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="form-page">
        <header className="form-header">
          <h1>Editar Aluguel</h1>
          <p>Altere os dados da locação.</p>
        </header>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <form className="custom-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="customer">Cliente</label>
                <select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                  <option value="">Selecione um cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="vehicle">Veículo</label>
                <select id="vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
                  <option value="">Selecione um veículo</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.brand} - {v.model}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="employee">Funcionário</label>
                <select id="employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required>
                  <option value="">Selecione o atendente</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Data de Início</label>
                <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Data de Devolução</label>
                <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/rentals')} disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default RentalEdit