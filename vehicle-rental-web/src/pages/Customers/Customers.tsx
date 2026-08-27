import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './Customers.css'

interface Customer {
  id: number
  name: string
  email?: string
  document?: string // Corrigido de cpf para document
  cpf?: string      // Fallback
  phone: string
  active?: boolean  // Campo booleano retornado pelo Spring Boot
  status?: string   // Campo alternativo caso a API envie String
}

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8085/v1/customers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar clientes')
        }
        return response.json()
      })
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : data.content || [])
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
      'Tem certeza que deseja excluir este cliente?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8085/v1/customers/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao excluir cliente')
      }

      setCustomers((currentCustomers) =>
        currentCustomers.filter((customer) => customer.id !== id)
      )
    } catch (error) {
      console.error(error)
      alert('Não foi possível excluir o cliente.')
    }
  }

  // Função atualizada para lidar com boolean (active) e string (status)
  const renderStatusBadge = (customer: Customer) => {
    // Se a API envia a propriedade booleana 'active'
    if (customer.active !== undefined) {
      return customer.active ? (
        <span className="badge badge-success">Ativo</span>
      ) : (
        <span className="badge badge-danger">Inativo</span>
      )
    }

    // Se a API envia uma string 'status'
    const statusNormalized = customer.status?.toUpperCase() || ''

    if (statusNormalized === 'ATIVO' || statusNormalized === 'ACTIVE') {
      return <span className="badge badge-success">Ativo</span>
    }
    if (statusNormalized === 'INATIVO' || statusNormalized === 'INACTIVE') {
      return <span className="badge badge-danger">Inativo</span>
    }
    if (statusNormalized === 'PENDENTE' || statusNormalized === 'PENDING') {
      return <span className="badge badge-warning">Pendente</span>
    }

    // Caso padrão quando cadastrado recente ou sem campo de status no banco
    return <span className="badge badge-success">Ativo</span>
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="customers-page">
        <header className="customers-header">
          <div>
            <h1>Gestão de Clientes</h1>
            <p>Gerencie a base de clientes e informações de contato.</p>
          </div>

          <Link to="/customers/new" className="new-customer-button">
            + Novo Cliente
          </Link>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Carregando lista de clientes...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum cliente cadastrado no sistema.</p>
            <Link to="/customers/new" className="button-link">
              Cadastrar o primeiro cliente
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th className="actions-header">Ações</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <span className="customer-name">{customer.name}</span>
                    </td>
                    <td>
                      <span className="info-mono">
                        {customer.document || customer.cpf || '—'}
                      </span>
                    </td>
                    <td>{customer.phone || '—'}</td>
                    <td>{renderStatusBadge(customer)}</td>

                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/customers/${customer.id}/edit`}
                          className="action-btn edit-btn"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default Customers