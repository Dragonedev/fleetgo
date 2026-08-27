import type { ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
  onConfirm: () => void
  confirmText?: string
  isDanger?: boolean
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirmar',
  isDanger = false,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <header className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </header>
        <div className="modal-body">{children}</div>
        <footer className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  )
}