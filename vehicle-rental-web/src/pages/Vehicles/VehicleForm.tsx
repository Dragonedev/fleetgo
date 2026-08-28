import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

const API_URL = 'https://fleetgo-5yk4.onrender.com/v1/vehicles'

function VehicleForm() {
  const navigate = useNavigate()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [manufactureYear, setManufactureYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [dailyRate, setDailyRate] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
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
        return 'Veículo não encontrado.'
      case 409:
        return 'Não foi possível cadastrar o veículo porque já existe um veículo com esses dados.'
      case 500:
        return 'Ocorreu um erro interno no servidor.'
      case 502:
      case 503:
        return 'O servidor está temporariamente indisponível.'
      default:
        return 'Não foi possível cadastrar o veículo. Tente novamente.'
    }
  }

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    const payload = {
      brand: brand.trim(),
      model: model.trim(),
      licensePlate: licensePlate.trim().toUpperCase(),
      year: Number(manufactureYear),
      mileage: Number(mileage),
      dailyRate: Number(dailyRate),
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response.status, responseData))
      }

      window.alert('Veículo cadastrado com sucesso!')
      navigate('/vehicles')
    } catch (err) {
      console.error('Erro ao cadastrar veículo:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="page-wrapper">
      <main className="form-page">
        <header className="form-header">
          <button
            type="button"
            className="back-link"
            onClick={() => navigate('/vehicles')}
            disabled={isSubmitting}
          >
            ← Voltar para listagem
          </button>

          <h1>Novo Veículo</h1>
          <p>Preencha os dados abaixo para cadastrar um novo veículo.</p>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">
                <h2>Dados do Veículo</h2>
                <p>Informe os dados do veículo e o valor da diária.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="brand">Marca</label>
                  <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    placeholder="Ex.: Toyota"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model">Modelo</label>
                  <input
                    id="model"
                    type="text"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    placeholder="Ex.: Corolla"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="licensePlate">Placa</label>
                  <input
                    id="licensePlate"
                    type="text"
                    value={licensePlate}
                    onChange={(event) => setLicensePlate(event.target.value.toUpperCase())}
                    placeholder="Ex.: ABC1D23"
                    maxLength={7}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="manufactureYear">Ano de Fabricação</label>
                  <input
                    id="manufactureYear"
                    type="number"
                    min="1900"
                    max="2100"
                    value={manufactureYear}
                    onChange={(event) => setManufactureYear(event.target.value)}
                    placeholder="Ex.: 2024"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mileage">Quilometragem (km)</label>
                  <input
                    id="mileage"
                    type="number"
                    min="0"
                    step="1"
                    value={mileage}
                    onChange={(event) => setMileage(event.target.value)}
                    placeholder="Ex.: 35000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dailyRate">Valor da Diária</label>
                  <div className="currency-input">
                    <span className="currency-prefix">R$</span>
                    <input
                      id="dailyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={dailyRate}
                      onChange={(event) => setDailyRate(event.target.value)}
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="form-error" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/vehicles')}
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
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Veículo'
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default VehicleForm