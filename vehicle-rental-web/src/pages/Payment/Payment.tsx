import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './Payment.css'

// =========================================================
// TIPOS E INTERFACES
// =========================================================

const API_URL = 'https://fleetgo-5yk4.onrender.com'

interface Customer {
  id: number
  name: string
  document?: string
  email?: string
  phone?: string
}

interface Vehicle {
  id: number
  model: string
  licensePlate?: string
  brand?: string
  category?: string
}

interface RentalDetail {
  id: number
  customerId: number
  vehicleId: number
  employeeId: number
  startDate: string
  endDate: string
  status: string
  paymentMethod?: string
  paymentStatus?: string
  totalAmount?: number
  customer?: Customer
  vehicle?: Vehicle
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

function Payment() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [rental, setRental] = useState<RentalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('PIX')
  const [success, setSuccess] = useState(false)

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
    if (data?.message) return data.message
    if (data?.error) return data.error

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

  const loadRental = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        rentalResponse,
        customersResponse,
        vehiclesResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/v1/rental-orders/${id}`),
        fetch(`${API_URL}/v1/customers`),
        fetch(`${API_URL}/v1/vehicles`),
      ])

      if (!rentalResponse.ok) {
        const data = await rentalResponse.json().catch(() => null)
        throw new Error(
          getApiErrorMessage(rentalResponse.status, data),
        )
      }

      const rentalData: RentalDetail = await rentalResponse.json()

      if (customersResponse.ok) {
        const customersData = await customersResponse.json()

        const customerList: Customer[] = Array.isArray(customersData)
          ? customersData
          : customersData.content || []

        const customerMap: Record<number, Customer> = {}

        customerList.forEach((customer) => {
          customerMap[customer.id] = customer
        })

        if (
          rentalData.customerId &&
          customerMap[rentalData.customerId]
        ) {
          rentalData.customer = customerMap[rentalData.customerId]
        }
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

        if (
          rentalData.vehicleId &&
          vehicleMap[rentalData.vehicleId]
        ) {
          rentalData.vehicle = vehicleMap[rentalData.vehicleId]
        }
      }

      setRental(rentalData)
    } catch (err) {
      console.error('Erro ao buscar locação:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadRental()
    }
  }, [id])

  // =========================================================
  // FUNÇÕES AUXILIARES
  // =========================================================

  const formatDate = (
    dateString: string | undefined,
  ): string => {
    if (!dateString) return '-'

    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return '-'
    }
  }

  const formatCurrency = (
    value: number | undefined,
  ): string => {
    if (value === undefined || value === null) {
      return 'R$ 0,00'
    }

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const getPaymentStatusLabel = (
    status?: string,
  ): string => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'Pago'
      case 'PENDING':
        return 'Pendente'
      case 'OVERDUE':
        return 'Vencido'
      default:
        return status || '—'
    }
  }

  // =========================================================
  // HANDLER DE PAGAMENTO
  // =========================================================

  const handlePayment = async () => {
    try {
      setProcessing(true)
      setError('')

      const response = await fetch(
        `${API_URL}/v1/rental-orders/${id}/pay`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod,
          }),
        },
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        throw new Error(
          getApiErrorMessage(response.status, data),
        )
      }

      setSuccess(true)

      await loadRental()
    } catch (err) {
      console.error('Erro ao processar pagamento:', err)
      setError(getErrorMessage(err))
    } finally {
      setProcessing(false)
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="payment-page-wrapper">
        <main className="payment-page">
          <div className="payment-loading">
            <div className="payment-spinner" />
            <span>Carregando informações...</span>
          </div>
        </main>
      </div>
    )
  }

  // =========================================================
  // ERRO
  // =========================================================

  if (error) {
    return (
      <div className="payment-page-wrapper">
        <main className="payment-page">
          <div className="payment-error">
            <div className="payment-error-icon">!</div>

            <h2>Não foi possível continuar</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => navigate('/rentals')}
              className="payment-button payment-button-secondary"
            >
              Voltar para locações
            </button>
          </div>
        </main>
      </div>
    )
  }

  // =========================================================
  // LOCAÇÃO NÃO ENCONTRADA
  // =========================================================

  if (!rental) {
    return (
      <div className="payment-page-wrapper">
        <main className="payment-page">
          <div className="payment-error">
            <div className="payment-error-icon">?</div>

            <h2>Locação não encontrada</h2>

            <p>Locação #{id} não encontrada.</p>

            <Link
              to="/rentals"
              className="payment-button payment-button-secondary"
            >
              Voltar para locações
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // =========================================================
  // PAGAMENTO JÁ REALIZADO
  // =========================================================

  if (rental.paymentStatus?.toUpperCase() === 'PAID') {
    return (
      <div className="payment-page-wrapper">
        <main className="payment-page">
          <div className="payment-card payment-card-success">
            <div className="payment-success-content">
              <div className="payment-success-icon">
                ✓
              </div>

              <h1>Pagamento confirmado!</h1>

              <p>
                O pagamento da locação #{rental.id} foi
                realizado com sucesso.
              </p>

              <div className="payment-success-status">
                <span className="payment-status-dot" />
                Pagamento realizado
              </div>

              <Link
                to="/rentals"
                className="payment-button payment-button-primary"
              >
                Voltar para locações
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="payment-page-wrapper">
      <main className="payment-page">

        {/* HEADER */}

        <header className="payment-header">
          <div>
            <span className="payment-brand">FLEETGO</span>

            <h1>
              Pagamento da Locação #{rental.id}
            </h1>

            <p>
              Confira os dados e selecione a forma de
              pagamento.
            </p>
          </div>

          <Link
            to="/rentals"
            className="payment-back-button"
          >
            ← Voltar
          </Link>
        </header>

        {/* CARD PRINCIPAL */}

        <div className="payment-card">

          {/* RESUMO */}

          <section className="payment-summary">
            <div className="payment-summary-header">
              <div>
                <h2>Resumo da Locação</h2>

                <p>
                  Confira os dados antes de realizar o
                  pagamento.
                </p>
              </div>

              <span
                className={`payment-status ${
                  rental.paymentStatus?.toUpperCase() === 'PAID'
                    ? 'payment-status-success'
                    : 'payment-status-pending'
                }`}
              >
                <span className="payment-status-dot" />

                {getPaymentStatusLabel(
                  rental.paymentStatus,
                )}
              </span>
            </div>

            <div className="payment-info-grid">
              <div className="payment-info-item">
                <span className="payment-info-label">
                  Cliente
                </span>

                <strong>
                  {rental.customer?.name ||
                    `Cliente #${rental.customerId}`}
                </strong>

                <small>
                  {rental.customer?.document || 'Documento não informado'}
                </small>
              </div>

              <div className="payment-info-item">
                <span className="payment-info-label">
                  Veículo
                </span>

                <strong>
                  {rental.vehicle?.brand || ''}{' '}
                  {rental.vehicle?.model ||
                    `Veículo #${rental.vehicleId}`}
                </strong>

                <small>
                  Placa:{' '}
                  {rental.vehicle?.licensePlate || '—'}
                </small>
              </div>

              <div className="payment-info-item">
                <span className="payment-info-label">
                  Retirada
                </span>

                <strong>
                  {formatDate(rental.startDate)}
                </strong>
              </div>

              <div className="payment-info-item">
                <span className="payment-info-label">
                  Devolução
                </span>

                <strong>
                  {formatDate(rental.endDate)}
                </strong>
              </div>
            </div>

            <div className="payment-total">
              <span>Valor Total</span>

              <strong>
                {formatCurrency(rental.totalAmount)}
              </strong>
            </div>
          </section>

          {/* PAGAMENTO */}

          <section className="payment-form">

            <div className="payment-form-header">
              <div>
                <h2>Forma de Pagamento</h2>

                <p>
                  Selecione a forma de pagamento desejada:
                </p>
              </div>
            </div>

            <div className="payment-options">

              {/* PIX */}

              <label
                htmlFor="pix"
                className={`payment-option ${
                  paymentMethod === 'PIX'
                    ? 'payment-option-selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  id="pix"
                  name="paymentMethod"
                  value="PIX"
                  checked={paymentMethod === 'PIX'}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span className="payment-radio">
                  <span />
                </span>

                <span className="payment-option-icon payment-icon-pix">
                  ◈
                </span>

                <span className="payment-option-content">
                  <strong>PIX</strong>
                  <small>
                    Pagamento instantâneo
                  </small>
                </span>
              </label>

              {/* CARTÃO */}

              <label
                htmlFor="creditCard"
                className={`payment-option ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'payment-option-selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="CREDIT_CARD"
                  checked={
                    paymentMethod === 'CREDIT_CARD'
                  }
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span className="payment-radio">
                  <span />
                </span>

                <span className="payment-option-icon payment-icon-card">
                  ▣
                </span>

                <span className="payment-option-content">
                  <strong>Cartão de Crédito</strong>
                  <small>
                    Crédito ou parcelamento
                  </small>
                </span>
              </label>

              {/* BOLETO */}

              <label
                htmlFor="boleto"
                className={`payment-option ${
                  paymentMethod === 'BOLETO'
                    ? 'payment-option-selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  id="boleto"
                  name="paymentMethod"
                  value="BOLETO"
                  checked={paymentMethod === 'BOLETO'}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span className="payment-radio">
                  <span />
                </span>

                <span className="payment-option-icon payment-icon-boleto">
                  ▤
                </span>

                <span className="payment-option-content">
                  <strong>Boleto</strong>
                  <small>
                    Pagamento via boleto bancário
                  </small>
                </span>
              </label>

              {/* DINHEIRO */}

              <label
                htmlFor="cash"
                className={`payment-option ${
                  paymentMethod === 'CASH'
                    ? 'payment-option-selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span className="payment-radio">
                  <span />
                </span>

                <span className="payment-option-icon payment-icon-cash">
                  $
                </span>

                <span className="payment-option-content">
                  <strong>Dinheiro</strong>
                  <small>
                    Pagamento em espécie
                  </small>
                </span>
              </label>

            </div>

            {/* SUCESSO */}

            {success && (
              <div className="payment-success-message">
                <div className="payment-success-message-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Pagamento realizado com sucesso!
                  </strong>

                  <span>
                    Sua locação foi atualizada.
                  </span>
                </div>

                <Link
                  to="/rentals"
                  className="payment-button payment-button-primary"
                >
                  Voltar para locações
                </Link>
              </div>
            )}

            {/* AÇÕES */}

            {!success && (
              <div className="payment-actions">
                <button
                  type="button"
                  className="payment-button payment-button-primary"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="button-spinner" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <span className="button-icon">✓</span>
                      Confirmar Pagamento
                    </>
                  )}
                </button>

                <Link
                  to="/rentals"
                  className="payment-button payment-button-secondary"
                >
                  <span className="button-icon">×</span>
                  Cancelar
                </Link>
              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  )
}

export default Payment