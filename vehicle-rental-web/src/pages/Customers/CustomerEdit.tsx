import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

function CustomerEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:8085/v1/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || '')
        setCpf(data.cpf || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`http://localhost:8085/v1/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cpf, email, phone }),
      })

      if (!response.ok) throw new Error('Erro ao atualizar cliente')

      alert('Cliente atualizado com sucesso!')
      navigate('/customers')
    } catch (error) {
      console.error(error)
      alert('Não foi possível atualizar o cliente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="form-page">
        <header className="form-header">
          <h1>Editar Cliente</h1>
          <p>Atualize as informações do cliente.</p>
        </header>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <form className="custom-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="name">Nome Completo</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telefone</label>
                <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/customers')} disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default CustomerEdit