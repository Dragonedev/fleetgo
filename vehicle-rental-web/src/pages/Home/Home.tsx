import React from 'react'
import Navbar from '../../components/Navbar'
import './Home.css'

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">
              GESTÃO DE FROTAS INTELIGENTE
            </span>

            <h1>
              Sua operação,
              <br />
              <span>em movimento</span>
            </h1>

            <p>
              Otimize operações de locação, controle ativos em tempo real e
              centralize cadastros de clientes e colaboradores em um ecossistema 
              integrado e altamente escalável.
            </p>

            <div className="hero-actions">
              <a href="/vehicles" className="home-button">
                Gerenciar Frota
              </a>

              <a href="/rentals" className="home-button-secondary">
                Painel de Locações
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>Gestão</strong>
                <span>Frota sob controle</span>
              </div>

              <div>
                <strong>Operação</strong>
                <span>Mais produtividade</span>
              </div>

              <div>
                <strong>Simplificação</strong>
                <span>Tudo em um só lugar</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle"></div>

            <img
              src="https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85"
              alt="Plataforma de Gestão FleetGo"
            />
          </div>
        </section>

        <section className="home-features">
          <div className="feature-card">
            <span className="feature-category">CONTROLE DE ATIVOS</span>
            <h3>Gestão de Veículos</h3>
            <p>
              Monitoramento individualizado de frota, controle rigoroso de 
              quilometragem, status operacional e histórico de utilização.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-category">OPERAÇÃO DE CONTRACTS</span>
            <h3>Ciclo de Locação</h3>
            <p>
              Ciclo de vida completo das locações com rastreabilidade de datas, 
              vinculação de condutores e automação de saídas e devoluções.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-category">GOVERNANÇA</span>
            <h3>Gestão de Pessoas</h3>
            <p>
              Administração centralizada de clientes e equipe de colaboradores 
              com níveis de permissão e histórico de interações.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home