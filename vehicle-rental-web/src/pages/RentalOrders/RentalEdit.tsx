import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

const API_URL = '${import.meta.env.VITE_API_URL}'

interface Customer {
  id: number
  name: string
}

interface Vehicle {
  id: number
  brand: string
  model: string
}

interface Employee {
  id: number
  name: string
}

interface RentalOrder {
  id: number
  customerId: number
  vehicleId: number
  employeeId: number
  startDate: string
  endDate: string
  paymentMethod?: string
}

function RentalEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customerId, setCustomerId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [customersResponse, vehiclesResponse, employeesResponse, rentalResponse] =
          await Promise.all([
            fetch(`${API_URL}/v1/customers`),
            fetch(`${API_URL}/v1/vehicles`),
            fetch(`${API_URL}/v1/employees`),
            fetch(`${API_URL}/v1/rental-orders/${id}`),
          ])

        if (!customersResponse.ok) {
          const data = await customersResponse.json().catch(() => null)
          throw new Error(`Clientes: ${getApiErrorMessage(customersResponse.status, data)}`)
        }

        if (!vehiclesResponse.ok) {
          const data = await vehiclesResponse.json().catch(() => null)
          throw new Error(`Veículos: ${getApiErrorMessage(vehiclesResponse.status, data)}`)
        }

        if (!employeesResponse.ok) {
          const data = await employeesResponse.json().catch(() => null)
          throw new Error(`Funcionários: ${getApiErrorMessage(employeesResponse.status, data)}`)
        }

        if (!rentalResponse.ok) {
          const data = await rentalResponse.json().catch(() => null)
          throw new Error(getApiErrorMessage(rentalResponse.status, data))
        }

        const customersData = await customersResponse.json()
        const vehiclesData = await vehiclesResponse.json()
        const employeesData = await employeesResponse.json()
        const rentalData: RentalOrder = await rentalResponse.json()

        setCustomers(Array.isArray(customersData) ? customersData : customersData.content || [])
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : vehiclesData.content || [])
        setEmployees(Array.isArray(employeesData) ? employeesData : employeesData.content || [])

        setCustomerId(String(rentalData.customerId))
        setVehicleId(String(rentalData.vehicleId))
        setEmployeeId(String(rentalData.employeeId))
        setStartDate(rentalData.startDate || '')
        setEndDate(rentalData.endDate || '')
        setPaymentMethod(rentalData.paymentMethod || 'CREDIT_CARD')
      } catch (err) {
        console.error('Erro ao carregar locação:', err)
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitting(true)
    setError('')

    const payload = {
      customerId: Number(customerId),
      vehicleId: Number(vehicleId),
      employeeId: Number(employeeId),
      startDate,
      endDate,
      paymentMethod,
    }

    try {
      const response = await fetch(`${API_URL}/v1/rental-orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response.status, responseData))
      }

      alert('Locação atualizada com sucesso!')
      navigate('/rentals')
    } catch (err) {
      console.error('Erro ao atualizar locação:', err)
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="page-wrapper">
      <main className="form-page">
        <header className="form-header">
          <button
            type="button"
            className="back-link"
            onClick={() => navigate('/rentals')}
            disabled={submitting}
          >
            ← Voltar para listagem
          </button>

          <h1>Editar Locação</h1>
          <p>Altere os dados da locação.</p>
        </header>

        <section className="form-card">
          {loading ? (
            <div className="form-loading">Carregando locação...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="section-title">
                  <h2>Detalhes do Contrato</h2>
                  <p>Atualize os dados do contrato de locação.</p>
                </div>

                <div className="form-grid">
                  {/* CLIENTE */}
                  <div className="form-group">
                    <label htmlFor="customer">Cliente</label>
                    <select
                      id="customer"
                      value={customerId}
                      onChange={(event) => setCustomerId(event.target.value)}
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* VEÍCULO */}
                  <div className="form-group">
                    <label htmlFor="vehicle">Veículo</label>
                    <select
                      id="vehicle"
                      value={vehicleId}
                      onChange={(event) => setVehicleId(event.target.value)}
                      required
                    >
                      <option value="">Selecione um veículo</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FUNCIONÁRIO */}
                  <div className="form-group">
                    <label htmlFor="employee">Funcionário</label>
                    <select
                      id="employee"
                      value={employeeId}
                      onChange={(event) => setEmployeeId(event.target.value)}
                      required
                    >
                      <option value="">Selecione o funcionário</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PAGAMENTO */}
                  <div className="form-group">
                    <label htmlFor="paymentMethod">Forma de Pagamento</label>
                    <select
                      id="paymentMethod"
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      required
                    >
                      <option value="CREDIT_CARD">Cartão de Crédito</option>
                      <option value="DEBIT_CARD">Cartão de Débito</option>
                      <option value="PIX">PIX</option>
                      <option value="CASH">Dinheiro</option>
                    </select>
                  </div>

                  {/* DATA RETIRADA */}
                  <div className="form-group">
                    <label htmlFor="startDate">Data de Retirada</label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      required
                    />
                  </div>

                  {/* DATA DEVOLUÇÃO */}
                  <div className="form-group">
                    <label htmlFor="endDate">Data de Devolução</label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(event) => setEndDate(event.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ERRO */}
              {error && (
                <div className="form-error" role="alert">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* AÇÕES */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate('/rentals')}
                  disabled={submitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}

export default RentalEdit