import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../../components/Navbar'
import './VehicleForm.css'

function VehicleForm() {
  const navigate = useNavigate()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [dailyRate, setDailyRate] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    const vehicle = {
      brand: brand.trim(),
      model: model.trim(),
      licensePlate: licensePlate.trim().toUpperCase(),
      year: Number(year),
      mileage: Number(mileage),
      dailyRate: Number(dailyRate),
    }

    try {
      const response = await fetch('http://localhost:8085/v1/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      })

      if (!response.ok) {
        throw new Error('Não foi possível cadastrar o veículo.')
      }

      alert('Veículo cadastrado com sucesso!')
      navigate('/vehicles')
    } catch (err) {
      console.error(err)
      setError('Não foi possível cadastrar o veículo. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/vehicles')
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="vehicle-form-page">
        <header className="vehicle-form-header">
          <button type="button" className="back-link" onClick={handleCancel}>
            ← Voltar para listagem
          </button>
          <h1>Novo Veículo</h1>
          <p>Preencha os dados abaixo para cadastrar um novo veículo na frota.</p>
        </header>

        <section className="vehicle-form-card">
          <form className="vehicle-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">
                <h2>Informações Técnicas</h2>
                <p>Identificação e especificações operacionais do veículo.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="brand">Marca</label>
                  <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Toyota"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model">Modelo</label>
                  <input
                    id="model"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ex: Corolla GR-S"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="licensePlate">Placa</label>
                  <input
                    id="licensePlate"
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="Ex: BRA2E19"
                    maxLength={8}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Ano de Fabricação</label>
                  <input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Ex: 2024"
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
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="Ex: 15000"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dailyRate">Valor da Diária</label>
                  <div className="input-with-prefix">
                    <span className="currency-symbol">R$</span>
                    <input
                      id="dailyRate"
                      type="number"
                      step="0.01"
                      min="0"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(e.target.value)}
                      placeholder="150,00"
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
                className="button button-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="button button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" /> Cadastrando...
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