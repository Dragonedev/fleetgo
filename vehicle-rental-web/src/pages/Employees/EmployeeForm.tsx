import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

interface EmployeeFormData {
  name: string
  employeeCode: string
  email: string
  phone: string
  position: string
}

const API_URL = 'http://localhost:8085/v1/employees'

const INITIAL_FORM_DATA: EmployeeFormData = {
  name: '',
  employeeCode: '',
  email: '',
  phone: '',
  position: '',
}

function EmployeeForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_FORM_DATA)
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
        return 'Funcionário não encontrado.'
      case 409:
        return 'Não foi possível cadastrar o funcionário porque já existe um registro com esses dados.'
      case 500:
        return 'Ocorreu um erro interno no servidor.'
      case 502:
      case 503:
        return 'O servidor está temporariamente indisponível.'
      default:
        return 'Não foi possível cadastrar o funcionário. Tente novamente.'
    }
  }

  // =========================================================
  // ALTERAÇÃO DOS CAMPOS
  // =========================================================

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  // =========================================================
  // CANCELAR
  // =========================================================

  const handleCancel = () => {
    navigate('/employees')
  }

  // =========================================================
  // CADASTRAR FUNCIONÁRIO
  // =========================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    const employee = {
      name: formData.name.trim(),
      employeeCode: formData.employeeCode.trim().toUpperCase(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      position: formData.position.trim(),
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        console.error('Erro retornado pela API:', responseData)
        throw new Error(getApiErrorMessage(response.status, responseData))
      }

      window.alert('Funcionário cadastrado com sucesso!')
      navigate('/employees')
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error)
      setError(getErrorMessage(error))
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
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            ← Voltar para listagem
          </button>

          <h1>Novo Funcionário</h1>
          <p>Preencha os dados abaixo para cadastrar um novo funcionário na equipe.</p>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">
                <h2>Dados do Funcionário</h2>
                <p>Informações de registro e cargo profissional.</p>
              </div>

              <div className="form-grid">
                {/* NOME */}
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Leonardo Beaumont"
                    autoComplete="name"
                    required
                  />
                </div>

                {/* CÓDIGO */}
                <div className="form-group">
                  <label htmlFor="employeeCode">Código do Funcionário</label>
                  <input
                    id="employeeCode"
                    name="employeeCode"
                    type="text"
                    value={formData.employeeCode}
                    onChange={handleChange}
                    placeholder="Ex: EMP-001"
                    maxLength={20}
                    required
                  />
                </div>

                {/* E-MAIL */}
                <div className="form-group">
                  <label htmlFor="email">E-mail Corporativo</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="leonardo@fleetgo.com"
                    autoComplete="email"
                    required
                  />
                </div>

                {/* TELEFONE */}
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(71) 98888-4321"
                    autoComplete="tel"
                    required
                  />
                </div>

                {/* CARGO */}
                <div className="form-group">
                  <label htmlFor="position">Cargo</label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Ex: Gerente de Operações"
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
                    <span className="spinner" aria-hidden="true" />
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Funcionário'
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default EmployeeForm