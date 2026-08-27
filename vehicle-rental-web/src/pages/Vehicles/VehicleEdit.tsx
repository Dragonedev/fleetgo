import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

function VehicleEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:8085/v1/vehicles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do veículo')
        }
        return response.json()
      })
      .then((vehicle) => {
        setBrand(vehicle.brand || '')
        setModel(vehicle.model || '')
        setLicensePlate(vehicle.licensePlate || '')
        setYear(vehicle.year ? String(vehicle.year) : '')
        setMileage(vehicle.mileage !== undefined ? String(vehicle.mileage) : '')
        setDailyRate(vehicle.dailyRate ? String(vehicle.dailyRate) : '')
      })
      .catch((error) => {
        console.error(error)
        alert('Não foi possível carregar as informações do veículo.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    const vehicle = {
      brand,
      model,
      licensePlate,
      year: Number(year),
      mileage: Number(mileage),
      dailyRate: Number(dailyRate),
    }

    try {
      const response = await fetch(
        `http://localhost:8085/v1/vehicles/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicle),
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao atualizar veículo')
      }

      alert('Veículo atualizado com sucesso!')
      navigate('/vehicles')
    } catch (error) {
      console.error(error)
      alert('Não foi possível atualizar o veículo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="vehicle-form-page">
        <header className="form-header">
          <h1>Editar Veículo</h1>
          <p>Atualize os dados e valores do veículo selecionado.</p>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Carregando dados do veículo...</p>
          </div>
        ) : (
          <form className="vehicle-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="brand">Marca</label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
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
                  onChange={(event) => setModel(event.target.value)}
                  placeholder="Ex: Corolla"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="licensePlate">Placa</label>
                <input
                  id="licensePlate"
                  type="text"
                  value={licensePlate}
                  onChange={(event) => setLicensePlate(event.target.value)}
                  placeholder="Ex: ABC1D23"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="year">Ano</label>
                <input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  placeholder="Ex: 2024"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mileage">Quilometragem (km)</label>
                <input
                  id="mileage"
                  type="number"
                  value={mileage}
                  onChange={(event) => setMileage(event.target.value)}
                  placeholder="Ex: 15000"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dailyRate">Valor da Diária (R$)</label>
                <input
                  id="dailyRate"
                  type="number"
                  step="0.01"
                  value={dailyRate}
                  onChange={(event) => setDailyRate(event.target.value)}
                  placeholder="Ex: 180.00"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/vehicles')}
                disabled={submitting}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default VehicleEdit