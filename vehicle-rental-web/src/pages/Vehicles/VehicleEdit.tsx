import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './VehicleForm.css'

function VehicleEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [dailyRate, setDailyRate] = useState('')

  useEffect(() => {
    fetch(`http://localhost:8085/v1/vehicles/${id}`)
      .then((response) => response.json())
      .then((vehicle) => {
        setBrand(vehicle.brand)
        setModel(vehicle.model)
        setLicensePlate(vehicle.licensePlate)
        setYear(String(vehicle.year))
        setMileage(String(vehicle.mileage))
        setDailyRate(String(vehicle.dailyRate))
      })
      .catch((error) => {
        console.error(error)
      })
  }, [id])

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
    }
  }

  return (
    <div>
      <Navbar />

      <main className="vehicle-form-page">
        <h1>Editar veículo</h1>
        <p>Atualize os dados do veículo.</p>

        <form className="vehicle-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Marca</label>
            <input
              type="text"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Modelo</label>
            <input
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Placa</label>
            <input
              type="text"
              value={licensePlate}
              onChange={(event) => setLicensePlate(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Ano</label>
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Quilometragem</label>
            <input
              type="number"
              value={mileage}
              onChange={(event) => setMileage(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Diária</label>
            <input
              type="number"
              step="0.01"
              value={dailyRate}
              onChange={(event) => setDailyRate(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
            >
              Cancelar
            </button>

            <button type="submit">
              Salvar alterações
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}

export default VehicleEdit