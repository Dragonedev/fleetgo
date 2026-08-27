import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

interface SelectOption {
  id: number
  name?: string
  model?: string
  brand?: string
}

function RentalForm() {
  const navigate = useNavigate()

  const [customers, setCustomers] = useState<SelectOption[]>([])
  const [vehicles, setVehicles] = useState<SelectOption[]>([])
  const [employees, setEmployees] = useState<SelectOption[]>([])

  const [customerId, setCustomerId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================================================
  // CARREGAR CLIENTES, VEÍCULOS E FUNCIONÁRIOS
  // =========================================================

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8085/v1/customers')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao carregar clientes')
          }

          return response.json()
        }),

      fetch('http://localhost:8085/v1/vehicles')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao carregar veículos')
          }

          return response.json()
        }),

      fetch('http://localhost:8085/v1/employees')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao carregar funcionários')
          }

          return response.json()
        }),
    ])
      .then(([customersData, vehiclesData, employeesData]) => {
        const parseData = (data: any) => {
          if (Array.isArray(data)) {
            return data
          }

          return data?.content || []
        }

        setCustomers(parseData(customersData))
        setVehicles(parseData(vehiclesData))
        setEmployees(parseData(employeesData))
      })
      .catch((err) => {
        console.error('Erro ao carregar dados:', err)
        setError(
          'Não foi possível carregar os clientes, veículos e funcionários.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // =========================================================
  // CADASTRAR LOCAÇÃO
  // =========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    const payload = {
      startDate,
      endDate,
      paymentMethod,
      customerId: Number(customerId),
      vehicleId: Number(vehicleId),
      employeeId: Number(employeeId),
    }

    console.log('Enviando locação:', payload)

    try {
      const response = await fetch(
        'http://localhost:8085/v1/rental-orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const responseData = await response
        .json()
        .catch(() => null)

      console.log('Resposta da API:', responseData)

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            'Não foi possível cadastrar a locação.'
        )
      }

      alert('Locação cadastrada com sucesso!')

      navigate('/rentals')
    } catch (err) {
      console.error('Erro ao cadastrar locação:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          'Não foi possível cadastrar a locação. Verifique os dados e tente novamente.'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="form-page">

        {/* CABEÇALHO */}
        <header className="form-header">

          <button
            type="button"
            className="back-link"
            onClick={() => navigate('/rentals')}
          >
            ← Voltar para listagem
          </button>

          <h1>Nova Locação</h1>

          <p>
            Preencha os dados abaixo para registrar um novo
            contrato de aluguel.
          </p>

        </header>

        {/* FORMULÁRIO */}
        <section className="form-card">

          {loading ? (

            <p
              className="loading-text"
              style={{
                color: '#9ca3af',
                textAlign: 'center',
              }}
            >
              Carregando dados do formulário...
            </p>

          ) : (

            <form onSubmit={handleSubmit}>

              <div className="form-section">

                <div className="section-title">

                  <h2>Detalhes do Contrato</h2>

                  <p>
                    Associação de cliente, veículo,
                    funcionário e forma de pagamento.
                  </p>

                </div>

                <div className="form-grid">

                  {/* CLIENTE */}
                  <div className="form-group">

                    <label htmlFor="customer">
                      Cliente
                    </label>

                    <select
                      id="customer"
                      required
                      value={customerId}
                      onChange={(event) =>
                        setCustomerId(event.target.value)
                      }
                    >

                      <option value="">
                        Selecione um cliente...
                      </option>

                      {customers.map((customer) => (
                        <option
                          key={customer.id}
                          value={customer.id}
                        >
                          {customer.name ||
                            `Cliente #${customer.id}`}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* VEÍCULO */}
                  <div className="form-group">

                    <label htmlFor="vehicle">
                      Veículo
                    </label>

                    <select
                      id="vehicle"
                      required
                      value={vehicleId}
                      onChange={(event) =>
                        setVehicleId(event.target.value)
                      }
                    >

                      <option value="">
                        Selecione um veículo...
                      </option>

                      {vehicles.map((vehicle) => (
                        <option
                          key={vehicle.id}
                          value={vehicle.id}
                        >
                          {vehicle.brand && vehicle.model
                            ? `${vehicle.brand} ${vehicle.model}`
                            : vehicle.model ||
                              `Veículo #${vehicle.id}`}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* FUNCIONÁRIO */}
                  <div className="form-group">

                    <label htmlFor="employee">
                      Funcionário Responsável
                    </label>

                    <select
                      id="employee"
                      required
                      value={employeeId}
                      onChange={(event) =>
                        setEmployeeId(event.target.value)
                      }
                    >

                      <option value="">
                        Selecione um funcionário...
                      </option>

                      {employees.map((employee) => (
                        <option
                          key={employee.id}
                          value={employee.id}
                        >
                          {employee.name ||
                            `Funcionário #${employee.id}`}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* PAGAMENTO */}
                  <div className="form-group">

                    <label htmlFor="paymentMethod">
                      Forma de Pagamento
                    </label>

                    <select
                      id="paymentMethod"
                      required
                      value={paymentMethod}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                    >

                      <option value="CREDIT_CARD">
                        Cartão de Crédito
                      </option>

                      <option value="DEBIT_CARD">
                        Cartão de Débito
                      </option>

                      <option value="PIX">
                        PIX
                      </option>

                      <option value="CASH">
                        Dinheiro
                      </option>

                    </select>

                  </div>

                  {/* DATA DE RETIRADA */}
                  <div className="form-group">

                    <label htmlFor="startDate">
                      Data de Retirada
                    </label>

                    <input
                      id="startDate"
                      type="date"
                      required
                      value={startDate}
                      onChange={(event) =>
                        setStartDate(event.target.value)
                      }
                    />

                  </div>

                  {/* DATA DE DEVOLUÇÃO */}
                  <div className="form-group">

                    <label htmlFor="endDate">
                      Data de Devolução
                    </label>

                    <input
                      id="endDate"
                      type="date"
                      required
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(event) =>
                        setEndDate(event.target.value)
                      }
                    />

                  </div>

                </div>

              </div>

              {/* ERRO */}
              {error && (
                <div
                  className="form-error"
                  role="alert"
                >
                  <span className="error-icon">
                    ⚠️
                  </span>

                  <span>{error}</span>
                </div>
              )}

              {/* BOTÕES */}
              <div className="form-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate('/rentals')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >

                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Locação'
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

export default RentalForm