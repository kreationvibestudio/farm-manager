"use client";

import { useEffect } from "react";
import { HarvestChart } from "@/components/dashboard/HarvestChart";
import { FleetStatus } from "@/components/dashboard/FleetStatus";
import { OERGauge } from "@/components/dashboard/OERGauge";
import { ResourceTank } from "@/components/dashboard/ResourceTank";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { TrendingUp, Package, Truck, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { 
    inventory, 
    vehicles, 
    harvestLogs,
    fetchInventory,
    fetchVehicles,
    fetchHarvestLogs 
  } = useAppStore();

  useEffect(() => {
    fetchInventory();
    fetchVehicles();
    fetchHarvestLogs();
  }, [fetchInventory, fetchVehicles, fetchHarvestLogs]);

  const totalHarvest = harvestLogs.reduce((acc, log) => acc + log.weightKg, 0);
  const activeVehiclesCount = vehicles.filter(v => v.status === 'Active').length;
  const lowStockCount = inventory.filter(item => item.quantity <= item.minLevel).length;
  const dieselItem = inventory.find(item => item.name.toLowerCase().includes('diesel'));
  const dieselReserve = dieselItem?.quantity || 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-primary">Palm Plantation Manager</h1>
      </header>

      <main className="flex-1 p-6 space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Real-time overview of plantation operations, deliverables, and inventory.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total FFB Harvested"
            value={`${totalHarvest.toLocaleString()} kg`}
            trend="+2.5%"
            trendUp={true}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Oil Extraction Rate"
            value="19.2%"
            trend="-0.1%"
            trendUp={false}
            icon={<Package className="h-4 w-4" />}
          />
          <StatCard
            title="Active Tractors"
            value={`${activeVehiclesCount}/${vehicles.length}`}
            status="Operating"
            icon={<Truck className="h-4 w-4" />}
          />
          <StatCard
            title="Diesel Reserve"
            value={`${dieselReserve} L`}
            status={dieselReserve < 500 ? "Low Stock" : "Adequate"}
            alert={dieselReserve < 500}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HarvestChart />
          </div>
          <div>
            <WeatherWidget />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <OERGauge />
          <FleetStatus />
          <ResourceTank />
        </div>

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
                {harvestLogs.slice(0, 5).map((log) => (
                  <TableRow 
                    key={log.id}
                    date={new Date(log.date).toLocaleDateString()} 
                    block={log.blockId} 
                    weight={log.weightKg.toLocaleString()} 
                    user={log.supervisorName || log.supervisorId || 'N/A'} 
                  />
                ))}
                {harvestLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                      No harvest logs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, status, alert, icon }: {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  status?: string;
  alert?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-primary/10 text-primary'}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      {status && (
        <div className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold max-w-fit
            ${alert
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          }`}>
          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${alert ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          {status}
        </div>
      )}
    </div>
  )
}

function TableRow({ date, block, weight, user }: { date: string; block: string; weight: string; user: string }) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-4 text-muted-foreground">{date}</td>
      <td className="p-4 font-medium">{block}</td>
      <td className="p-4">{weight}</td>
      <td className="p-4 text-muted-foreground">{user}</td>
    </tr>
  )
}
