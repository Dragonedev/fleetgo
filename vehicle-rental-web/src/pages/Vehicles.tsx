import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import './Vehicles.css'

interface Vehicle {
  id: number
  brand: string
  model: string
  licensePlate: string
  year: number
  mileage: number
  dailyRate: number
  status: string
}

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8085/v1/vehicles')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar veículos')
        }

        return response.json()
      })
      .then((data) => {
        setVehicles(data.content)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este veículo?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8085/v1/vehicles/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir veículo')
      }

      setVehicles((currentVehicles) =>
        currentVehicles.filter((vehicle) => vehicle.id !== id)
      )

      alert('Veículo excluído com sucesso!')

    } catch (error) {
      console.error(error)
      alert('Não foi possível excluir o veículo.')
    }
  }

  return (
    <div>
      <Navbar />

      <main className="vehicles-page">
        <div className="vehicles-header">
          <div>
            <h1>Veículos</h1>
            <p>Gerencie os veículos cadastrados no sistema.</p>
          </div>

          <a href="/vehicles/new" className="new-vehicle-button">
            + Novo veículo
          </a>
        </div>

        {loading ? (
          <p>Carregando veículos...</p>
        ) : (
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Placa</th>
                <th>Ano</th>
                <th>Diária</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.licensePlate}</td>
                  <td>{vehicle.year}</td>
                  <td>R$ {vehicle.dailyRate.toFixed(2)}</td>
                  <td>{vehicle.status}</td>

                  <td>
                    <a href={`/vehicles/${vehicle.id}/edit`}>
                      Editar
                    </a>

                    <button
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}

export default Vehicles