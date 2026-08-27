import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

const API_URL = 'http://localhost:8085/v1/customers'

function CustomerForm() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [document, setDocument] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

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
        return 'Cliente não encontrado.'
      case 409:
        return 'Não foi possível cadastrar o cliente porque já existe um cliente com esses dados.'
      case 500:
        return 'Ocorreu um erro interno no servidor.'
      case 502:
      case 503:
        return 'O servidor está temporariamente indisponível.'
      default:
        return 'Não foi possível cadastrar o cliente. Tente novamente.'
    }
  }

  // =========================================================
  // CADASTRAR CLIENTE
  // =========================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    const customer = {
      name: name.trim(),
      document: document.trim(),
      email: email.trim(),
      phone: phone.trim(),
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        console.error('Erro retornado pela API:', responseData)
        throw new Error(getApiErrorMessage(response.status, responseData))
      }

      window.alert('Cliente cadastrado com sucesso!')
      navigate('/customers')
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err)
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
            onClick={() => navigate('/customers')}
            disabled={isSubmitting}
          >
            ← Voltar para listagem
          </button>

          <h1>Novo Cliente</h1>
          <p>Preencha os dados abaixo para cadastrar um novo cliente no sistema.</p>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">
                <h2>Informações Pessoais</h2>
                <p>Dados de identificação e contato do cliente.</p>
              </div>

              <div className="form-grid">
                {/* NOME */}
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ex: Alexander Beaumont"
                    autoComplete="name"
                    required
                  />
                </div>

                {/* CPF */}
                <div className="form-group">
                  <label htmlFor="document">CPF</label>
                  <input
                    id="document"
                    type="text"
                    value={document}
                    onChange={(event) => setDocument(event.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>

                {/* E-MAIL */}
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="alexander.beaumont@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                {/* TELEFONE */}
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="(71) 99999-9999"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ERRO */}
            {error && (
              <div className="form-error" role="alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* AÇÕES */}
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
                    <span className="spinner" aria-hidden="true" />
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