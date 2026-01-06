"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Calculator, Receipt, Wallet, Target, PieChart } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function FinancialPage() {
  const {
    costEntries,
    salesRecords,
    budgets,
    financialSummary,
    fetchCostEntries,
    fetchSalesRecords,
    fetchBudgets,
    fetchFinancialSummary,
    isLoading
  } = useAppStore();

  useEffect(() => {
    fetchCostEntries();
    fetchSalesRecords();
    fetchBudgets();
    fetchFinancialSummary("2024-01-01", "2024-12-31");
  }, [fetchCostEntries, fetchSalesRecords, fetchBudgets, fetchFinancialSummary]);

  const totalCosts = costEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalRevenue = salesRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const pendingPayments = salesRecords.filter(r => r.paymentStatus === 'Pending').length;
  const activeBudgets = budgets.filter(b => b.status === 'Active').length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Financial Management</h1>
            <p className="text-muted-foreground">Complete financial overview and management system</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Receipt className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Key Financial Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦ {totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                {salesRecords.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦ {totalCosts.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                {costEntries.length} entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              {netProfit >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦ {netProfit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {profitMargin.toFixed(1)}% margin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBudgets}</div>
              <p className="text-xs text-muted-foreground">
                {pendingPayments} pending payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/financial/costs'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cost Tracking
              </CardTitle>
              <CardDescription>
                Track all operational expenses and costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{costEntries.length}</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/financial/sales'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue & Sales
              </CardTitle>
              <CardDescription>
                Manage FFB sales and revenue tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{salesRecords.length}</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/financial/budgets'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Budget Planning
              </CardTitle>
              <CardDescription>
                Annual budgets and financial planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{budgets.length}</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Costs</CardTitle>
              <CardDescription>Latest cost entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.dateIncurred).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-medium">₦ {entry.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {costEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground">No cost entries yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest sales records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesRecords.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{record.buyerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.saleDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₦ {record.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      <Badge variant={record.paymentStatus === 'Paid' ? 'default' : 'secondary'} className="ml-2">
                        {record.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
                {salesRecords.length === 0 && (
                  <p className="text-sm text-muted-foreground">No sales records yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Current budget status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgets.slice(0, 3).map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{budget.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {budget.budgetYear} • ₦ {budget.totalBudget.toLocaleString('en-NG')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      budget.status === 'Approved' ? 'default' :
                      budget.status === 'Submitted' ? 'secondary' : 'outline'
                    }>
                      {budget.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {budgets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No budgets created yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
