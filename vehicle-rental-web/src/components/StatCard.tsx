import './StatCard.css'

interface StatCardProps {
  title: string
  value: string | number
  icon?: string
  trend?: string
  trendNegative?: boolean
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendNegative = false,
  color = 'blue'
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {icon && <span className="stat-icon">{icon}</span>}
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${trendNegative ? 'negative' : 'positive'}`}>
          {trend}
        </div>
      )}
    </div>
  )
}