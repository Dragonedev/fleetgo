import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import '../../styles/FormStyles.css'

function EmployeeForm() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [employeeCode, setEmployeeCode] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    const employee = {
      name: name.trim(),
      employeeCode: employeeCode.trim().toUpperCase(),
      email: email.trim(),
      phone: phone.trim(),
      position: position.trim(),
    }

    try {
      const response = await fetch('http://localhost:8085/v1/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Erro da API:', errorData)

        throw new Error('Não foi possível cadastrar o funcionário.')
      }

      alert('Funcionário cadastrado com sucesso!')
      navigate('/employees')
    } catch (err) {
      console.error(err)
      setError('Não foi possível cadastrar o funcionário. Tente novamente.')
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
            onClick={() => navigate('/employees')}
          >
            ← Voltar para listagem
          </button>

          <h1>Novo Funcionário</h1>

          <p>
            Preencha os dados abaixo para cadastrar um novo funcionário na
            equipe.
          </p>
        </header>

        <section className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="section-title">
                <h2>Dados do Funcionário</h2>
                <p>
                  Informações de registro e cargo profissional.
                </p>
              </div>

              <div className="form-grid">

                {/* Nome */}
                <div className="form-group">
                  <label htmlFor="name">
                    Nome Completo
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Leonardo Beaumont"
                    required
                  />
                </div>

                {/* Código */}
                <div className="form-group">
                  <label htmlFor="employeeCode">
                    Código do Funcionário
                  </label>

                  <input
                    id="employeeCode"
                    type="text"
                    value={employeeCode}
                    onChange={(e) =>
                      setEmployeeCode(e.target.value)
                    }
                    placeholder="Ex: EMP-001"
                    maxLength={20}
                    required
                  />
                </div>

                {/* E-mail */}
                <div className="form-group">
                  <label htmlFor="email">
                    E-mail Corporativo
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leonardo@fleetgo.com"
                    required
                  />
                </div>

                {/* Telefone */}
                <div className="form-group">
                  <label htmlFor="phone">
                    Telefone
                  </label>

                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(71) 98888-4321"
                    required
                  />
                </div>

                {/* Cargo */}
                <div className="form-group">
                  <label htmlFor="position">
                    Cargo
                  </label>

                  <input
                    id="position"
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Ex: Gerente de Operações"
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
                onClick={() => navigate('/employees')}
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