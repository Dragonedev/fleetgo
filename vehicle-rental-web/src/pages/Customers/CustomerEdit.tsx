import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

const API_URL = 'http://localhost:8085'

interface Customer {
  id: number
  name: string
  document: string
  email: string
  phone: string
}

function CustomerEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [document, setDocument] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
        return 'Cliente não encontrado.'
      case 409:
        return 'Não foi possível atualizar o cliente porque existe um conflito nos dados.'
      case 500:
        return 'Ocorreu um erro interno no servidor.'
      case 502:
      case 503:
        return 'O servidor está temporariamente indisponível.'
      default:
        return 'Não foi possível atualizar o cliente. Tente novamente.'
    }
  }

  // =========================================================
  // REQUISIÇÕES
  // =========================================================

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/v1/customers/${id}`)

        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(getApiErrorMessage(response.status, data))
        }

        const data: Customer = await response.json()

        setName(data.name || '')
        setDocument(data.document || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
      } catch (err) {
        console.error('Erro ao carregar cliente:', err)
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadCustomer()
    }
  }, [id])

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitting(true)
    setError('')

    const payload = {
      name: name.trim(),
      document: document.trim(),
      email: email.trim(),
      phone: phone.trim(),
    }

    try {
      const response = await fetch(`${API_URL}/v1/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response.status, responseData))
      }

      alert('Cliente atualizado com sucesso!')
      navigate('/customers')
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err)
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
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
            onClick={() => navigate('/customers')}
            disabled={submitting}
          >
            ← Voltar para listagem
          </button>

          <h1>Editar Cliente</h1>
          <p>Atualize as informações do cliente.</p>
        </header>

        <section className="form-card">
          {loading ? (
            <div className="form-loading">Carregando cliente...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="section-title">
                  <h2>Informações Pessoais</h2>
                  <p>Atualize os dados de identificação e contato.</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Nome Completo</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="document">CPF</label>
                    <input
                      id="document"
                      type="text"
                      value={document}
                      onChange={(event) => setDocument(event.target.value)}
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
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Telefone</label>
                    <input
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
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
                  disabled={submitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
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
          )}
        </section>
      </main>
    </div>
  )
}

export default CustomerEdit