import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'

import '../../styles/FormStyles.css'

function CustomerForm() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    const customer = {
      name: name.trim(),
      document: cpf.trim(),
      email: email.trim(),
      phone: phone.trim(),
    }

    try {
      const response = await fetch('http://localhost:8085/v1/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      })

      if (!response.ok) {
        const errorData = await response.text()

        console.error('Erro retornado pela API:', errorData)

        throw new Error(
          errorData || 'Não foi possível cadastrar o cliente.'
        )
      }

      alert('Cliente cadastrado com sucesso!')
      navigate('/customers')
    } catch (err) {
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Não foi possível cadastrar o cliente. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="form-page">
        <header className="form-header">
          <button
            type="button"
            className="back-link"
            onClick={() => navigate('/customers')}
          >
            ← Voltar para listagem
          </button>

          <h1>Novo Cliente</h1>

          <p>
            Preencha os dados abaixo para cadastrar um novo cliente no sistema.
          </p>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">
                <h2>Informações Pessoais</h2>
                <p>Dados de identificação e contato do cliente.</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Alexander Beaumont"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cpf">CPF</label>

                  <input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander.beaumont@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>

                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(71) 99999-9999"
                    required
                  />
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
                onClick={() => navigate('/customers')}
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
                  'Cadastrar Cliente'
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default CustomerForm