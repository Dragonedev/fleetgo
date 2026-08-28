import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// REMOVIDO: import Navbar from '../../components/Navbar'
import { Modal } from '../../components/Modal'
import './Customers.css'

// =========================================================
// TIPOS E INTERFACES
// =========================================================

interface Customer {
  id: number
  name: string
  document: string
  email: string
  phone: string
  active: boolean
}

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================

function Customers() {
  // =========================================================
  // STATES
  // =========================================================

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estados do Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null)
  const [customerNameToDelete, setCustomerNameToDelete] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

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
        return 'O recurso solicitado não foi encontrado.'
      case 409:
        return 'Não foi possível realizar a operação porque existe um conflito nos dados.'
      case 500:
        return 'Ocorreu um erro interno no servidor.'
      case 502:
      case 503:
        return 'O servidor está temporariamente indisponível.'
      default:
        return 'Não foi possível realizar a operação. Tente novamente.'
    }
  }

  // =========================================================
  // FUNÇÕES AUXILIARES
  // =========================================================

  const formatDocument = (document: string): string => {
    if (document.length === 11) {
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    if (document.length === 14) {
      return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }

    return document
  }

  const formatPhone = (phone: string): string => {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }

    if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    return phone
  }

  // =========================================================
  // REQUISIÇÕES
  // =========================================================

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('https://fleetgo-5yk4.onrender.com/v1/customers')

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(getApiErrorMessage(response.status, data))
      }

      const data = await response.json()
      setCustomers(Array.isArray(data) ? data : data.content || [])
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleDeleteClick = (id: number, name: string) => {
    setCustomerToDelete(id)
    setCustomerNameToDelete(name)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return

    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(
        `https://fleetgo-5yk4.onrender.com/v1/customers/${customerToDelete}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const data = await response.json().catch(() => null)

        if (response.status === 409) {
          throw new Error(
            'Este cliente não pode ser excluído pois possui locações ativas.'
          )
        }

        throw new Error(getApiErrorMessage(response.status, data))
      }

      setCustomers((currentCustomers) =>
        currentCustomers.filter((customer) => customer.id !== customerToDelete)
      )

      setShowDeleteModal(false)
      setCustomerToDelete(null)
      setCustomerNameToDelete('')
    } catch (err) {
      console.error('Erro ao excluir cliente:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false)
      setCustomerToDelete(null)
      setCustomerNameToDelete('')
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  const renderStatusBadge = (active: boolean) => {
    return active ? (
      <span className="badge badge-success">Ativo</span>
    ) : (
      <span className="badge badge-danger">Inativo</span>
    )
  }

  // =========================================================
  // RENDER PRINCIPAL
  // =========================================================

  return (
    <div className="page-wrapper">
      <main className="customers-page">
        <header className="customers-header">
          <div>
            <span className="page-label">FLEETGO</span>
            <h1>Clientes</h1>
            <p>Gerencie a base de clientes e informações de contato.</p>
          </div>

          <Link to="/customers/new" className="new-customer-button">
            <span>+</span>
            Novo Cliente
          </Link>
        </header>

        <section className="customers-card">
          <div className="customers-card-header">
            <div>
              <h2>Clientes cadastrados</h2>
              <p>Visualize e gerencie os clientes do sistema.</p>
            </div>
            <span className="customer-count">
              {customers.length} {customers.length === 1 ? 'cliente' : 'clientes'}
            </span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <span>Carregando clientes...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button type="button" onClick={loadCustomers} className="retry-button">
                  Tentar novamente
                </button>
              </div>
            ) : customers.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum cliente cadastrado.</p>
                <Link to="/customers/new" className="empty-state-link">
                  Cadastrar primeiro cliente
                </Link>
              </div>
            ) : (
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Documento</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th className="actions-column">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{customer.name}</strong>
                            <span>{customer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="info-mono">{formatDocument(customer.document)}</span>
                      </td>
                      <td>
                        <span className="customer-phone">{formatPhone(customer.phone)}</span>
                      </td>
                      <td>{renderStatusBadge(customer.active)}</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/customers/${customer.id}/edit`} className="action-button">
                            Editar
                          </Link>
                          <button
                            type="button"
                            className="action-button danger"
                            onClick={() => handleDeleteClick(customer.id, customer.name)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <Modal
        isOpen={showDeleteModal}
        title="Excluir Cliente"
        icon="🗑️"
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isDeleting}
        size="sm"
      >
        <p>
          Tem certeza que deseja excluir o cliente{' '}
          <strong style={{ color: '#f9fafb' }}>{customerNameToDelete}</strong>?
        </p>
        <p style={{ 
          color: '#f87171', 
          fontSize: '14px',
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⚠️</span> Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}

export default Customers