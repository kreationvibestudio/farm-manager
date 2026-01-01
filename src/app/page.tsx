export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header Placeholder */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-primary">Palm Plantation Manager</h1>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of plantation operations, deliverables, and inventory.</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Total FFB Harvested" value="12,450 kg" trend="+2.5%" />
          <DashboardCard title="Oil Extraction Rate" value="19.2%" trend="-0.1%" />
          <DashboardCard title="Active Tractors" value="8/10" status="Operating" />
          <DashboardCard title="Diesel Reserve" value="1,200 L" status="Low Stock" alert />
        </div>

        {/* Recent Activity Section */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Recent Harvest Logs</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Block</th>
                  <th className="p-4 font-medium">Weight (kg)</th>
                  <th className="p-4 font-medium">Supervisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <TableRow date="Today, 10:30 AM" block="Block A-12" weight="2,400" user="John Doe" />
                <TableRow date="Today, 09:15 AM" block="Block B-04" weight="1,850" user="Jane Smith" />
                <TableRow date="Yesterday" block="Block A-11" weight="3,200" user="John Doe" />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, value, trend, status, alert }: { title: string, value: string, trend?: string, status?: string, alert?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <span className={`text-xs ${trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
            {trend} from yesterday
          </span>
        )}
      </div>
      {status && (
        <div className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold max-w-fit
            ${alert
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          }`}>
          {status}
        </div>
      )}
    </div>
  )
}

function TableRow({ date, block, weight, user }: { date: string, block: string, weight: string, user: string }) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-4 text-muted-foreground">{date}</td>
      <td className="p-4 font-medium">{block}</td>
      <td className="p-4">{weight}</td>
      <td className="p-4 text-muted-foreground">{user}</td>
    </tr>
  )
}
