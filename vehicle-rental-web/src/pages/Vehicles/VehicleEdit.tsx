import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

interface VehicleFormData {
  brand: string
  model: string
  licensePlate: string
  year: string
  mileage: string
  dailyRate: string
}

function VehicleEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    licensePlate: '',
    year: '',
    mileage: '',
    dailyRate: '',
  })

  const [loading, setLoading] = useState(true)
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
        return 'Não foi possível atualizar o veículo porque existe um conflito nos dados.'
      case 500:
        return 'Ocorreu um erro interno no servidor.'
      case 502:
      case 503:
        return 'O servidor está temporariamente indisponível.'
      default:
        return 'Não foi possível atualizar o veículo. Tente novamente.'
    }
  }

  // =========================================================
  // REQUISIÇÕES
  // =========================================================

  useEffect(() => {
    if (!id) {
      setError('Veículo não encontrado.')
      setLoading(false)
      return
    }

    loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`http://localhost:8085/v1/vehicles/${id}`)

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(getApiErrorMessage(response.status, data))
      }

      const vehicle = await response.json()

      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        licensePlate: vehicle.licensePlate || '',
        year: vehicle.year !== undefined ? String(vehicle.year) : '',
        mileage: vehicle.mileage !== undefined ? String(vehicle.mileage) : '',
        dailyRate: vehicle.dailyRate !== undefined ? String(vehicle.dailyRate) : '',
      })
    } catch (err) {
      console.error('Erro ao carregar veículo:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!id) {
      return
    }

    setError('')
    setIsSubmitting(true)

    const vehicle = {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      licensePlate: formData.licensePlate.trim().toUpperCase(),
      year: Number(formData.year),
      mileage: Number(formData.mileage),
      dailyRate: Number(formData.dailyRate),
    }

    try {
      const response = await fetch(`http://localhost:8085/v1/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(getApiErrorMessage(response.status, data))
      }

      alert('Veículo atualizado com sucesso!')
      navigate('/vehicles')
    } catch (err) {
      console.error('Erro ao atualizar veículo:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/vehicles')
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
            onClick={handleCancel}
          >
            ← Voltar para listagem
          </button>

          <h1>Editar Veículo</h1>
          <p>Atualize os dados e informações do veículo selecionado.</p>
        </header>

        {loading ? (
          <section className="form-card">
            <div className="loading-state">
              <span className="spinner" />
              <p>Carregando dados do veículo...</p>
            </div>
          </section>
        ) : (
          <section className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="section-title">
                  <h2>Informações do Veículo</h2>
                  <p>Atualize os dados cadastrais e operacionais.</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="brand">Marca</label>
                    <input
                      id="brand"
                      type="text"
                      value={formData.brand}
                      onChange={(event) => handleChange('brand', event.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="model">Modelo</label>
                    <input
                      id="model"
                      type="text"
                      value={formData.model}
                      onChange={(event) => handleChange('model', event.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="licensePlate">Placa</label>
                    <input
                      id="licensePlate"
                      type="text"
                      value={formData.licensePlate}
                      onChange={(event) => handleChange('licensePlate', event.target.value)}
                      maxLength={8}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="year">Ano de Fabricação</label>
                    <input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(event) => handleChange('year', event.target.value)}
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mileage">Quilometragem (km)</label>
                    <input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(event) => handleChange('mileage', event.target.value)}
                      min="0"
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
                        step="0.01"
                        min="0"
                        value={formData.dailyRate}
                        onChange={(event) => handleChange('dailyRate', event.target.value)}
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
                  onClick={handleCancel}
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
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}

export default VehicleEdit