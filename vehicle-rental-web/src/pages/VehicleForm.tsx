import { FormEvent, useState } from 'react'
import Navbar from '../components/Navbar'
import './VehicleForm.css'

function VehicleForm() {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [dailyRate, setDailyRate] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const vehicle = {
      brand,
      model,
      licensePlate,
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
        throw new Error('Erro ao cadastrar veículo')
      }

      alert('Veículo cadastrado com sucesso!')

    } catch (error) {
      console.error(error)
      alert('Não foi possível cadastrar o veículo.')
    }
  }

  return (
    <div>
      <Navbar />

      <main className="vehicle-form-page">
        <h1>Novo veículo</h1>
        <p>Cadastre um novo veículo no sistema.</p>

        <form className="vehicle-form" onSubmit={handleSubmit}>

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
              placeholder="Ex: ABC-1234"
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
              placeholder="Ex: 2025"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mileage">Quilometragem</label>
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
            <label htmlFor="dailyRate">Diária</label>
            <input
              id="dailyRate"
              type="number"
              step="0.01"
              value={dailyRate}
              onChange={(event) => setDailyRate(event.target.value)}
              placeholder="Ex: 150.00"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button">
              Cancelar
            </button>

            <button type="submit">
              Cadastrar veículo
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}

export default VehicleForm