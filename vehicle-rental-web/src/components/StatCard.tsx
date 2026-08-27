import './StatCard.css'

interface StatCardProps {
  title: string
  value: string | number
  icon?: string
  trend?: string
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {icon && <span className="stat-icon">{icon}</span>}
      </div>
      <div className="stat-value">{value}</div>
      {trend && <div className="stat-trend">{trend}</div>}
    </div>
  )
}