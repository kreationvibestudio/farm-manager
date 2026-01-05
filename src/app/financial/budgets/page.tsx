"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Filter, Download, Edit, Trash2, CheckCircle, Clock, DollarSign, FileText, Target, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Budget, BudgetItem } from "@/types";
import { useSession } from "next-auth/react";

export default function BudgetPlanningPage() {
  const { data: session } = useSession();
  const {
    budgets,
    budgetCategories,
    fetchBudgets,
    fetchBudgetCategories,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetItems,
    addBudgetItem,
    updateBudgetItem,
    approveBudget,
    submitBudget,
    calculateBudgetVariance,
    isLoading
  } = useAppStore();

  const [filters, setFilters] = useState({
    year: "",
    status: "",
    search: ""
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false);

  // Form state for budget
  const [budgetFormData, setBudgetFormData] = useState({
    name: "",
    description: "",
    budgetYear: new Date().getFullYear(),
    budgetQuarter: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
    currency: "NGN",
    status: "Draft",
    notes: ""
  });

  // Form state for budget item
  const [itemFormData, setItemFormData] = useState({
    budgetCategoryId: "",
    costCategoryId: "",
    plannedAmount: "",
    allocatedAmount: "",
    blockId: "",
    department: "",
    notes: ""
  });

  useEffect(() => {
    fetchBudgets(filters);
    fetchBudgetCategories();
  }, [fetchBudgets, fetchBudgetCategories, filters]);

  const handleAddBudget = async () => {
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return;
    }

    try {
      await addBudget({
        name: budgetFormData.name,
        description: budgetFormData.description,
        budgetYear: budgetFormData.budgetYear,
        budgetQuarter: budgetFormData.budgetQuarter ? parseInt(budgetFormData.budgetQuarter) : undefined,
        startDate: budgetFormData.startDate,
        endDate: budgetFormData.endDate,
        totalBudget: parseFloat(budgetFormData.totalBudget),
        currency: budgetFormData.currency,
        status: budgetFormData.status as any,
        createdBy: session.user.id,
        notes: budgetFormData.notes || undefined,
      });

      setIsAddDialogOpen(false);
      resetBudgetForm();
    } catch (error) {
      console.error("Failed to add budget:", error);
    }
  };

  const handleEditBudget = async () => {
    if (!editingBudget) return;

    try {
      await updateBudget(editingBudget.id, {
        name: budgetFormData.name,
        description: budgetFormData.description,
        budgetYear: budgetFormData.budgetYear,
        budgetQuarter: budgetFormData.budgetQuarter ? parseInt(budgetFormData.budgetQuarter) : undefined,
        startDate: budgetFormData.startDate,
        endDate: budgetFormData.endDate,
        totalBudget: parseFloat(budgetFormData.totalBudget),
        currency: budgetFormData.currency,
        status: budgetFormData.status as any,
        notes: budgetFormData.notes || undefined,
      });

      setEditingBudget(null);
      resetBudgetForm();
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudget(id);
      } catch (error) {
        console.error("Failed to delete budget:", error);
      }
    }
  };

  const handleApproveBudget = async (id: string) => {
    try {
      await approveBudget(id);
    } catch (error) {
      console.error("Failed to approve budget:", error);
    }
  };

  const handleSubmitBudget = async (id: string) => {
    try {
      await submitBudget(id);
    } catch (error) {
      console.error("Failed to submit budget:", error);
    }
  };

  const resetBudgetForm = () => {
    setBudgetFormData({
      name: "",
      description: "",
      budgetYear: new Date().getFullYear(),
      budgetQuarter: "",
      startDate: "",
      endDate: "",
      totalBudget: "",
      currency: "NGN",
      status: "Draft",
      notes: ""
    });
    setSelectedStartDate(undefined);
    setSelectedEndDate(undefined);
  };

  const openEditDialog = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetFormData({
      name: budget.name,
      description: budget.description || "",
      budgetYear: budget.budgetYear,
      budgetQuarter: budget.budgetQuarter?.toString() || "",
      startDate: budget.startDate,
      endDate: budget.endDate,
      totalBudget: budget.totalBudget.toString(),
      currency: budget.currency,
      status: budget.status,
      notes: budget.notes || ""
    });
    setSelectedStartDate(new Date(budget.startDate));
    setSelectedEndDate(new Date(budget.endDate));
  };

  const openItemsDialog = async (budgetId: string) => {
    setSelectedBudgetId(budgetId);
    const items = await getBudgetItems(budgetId);
    setBudgetItems(items);
    setIsItemsDialogOpen(true);
  };

  const handleAddBudgetItem = async () => {
    if (!selectedBudgetId) return;

    try {
      await addBudgetItem({
        budgetId: selectedBudgetId,
        budgetCategoryId: itemFormData.budgetCategoryId,
        costCategoryId: itemFormData.costCategoryId || undefined,
        plannedAmount: parseFloat(itemFormData.plannedAmount),
        allocatedAmount: parseFloat(itemFormData.allocatedAmount),
        blockId: itemFormData.blockId || undefined,
        department: itemFormData.department || undefined,
        notes: itemFormData.notes || undefined,
      });

      // Refresh items
      const items = await getBudgetItems(selectedBudgetId);
      setBudgetItems(items);
      resetItemForm();
    } catch (error) {
      console.error("Failed to add budget item:", error);
    }
  };

  const resetItemForm = () => {
    setItemFormData({
      budgetCategoryId: "",
      costCategoryId: "",
      plannedAmount: "",
      allocatedAmount: "",
      blockId: "",
      department: "",
      notes: ""
    });
  };

  const filteredBudgets = budgets.filter(budget => {
    if (filters.search && !budget.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalBudgeted = filteredBudgets.reduce((sum, budget) => sum + budget.totalBudget, 0);
  const activeBudgets = filteredBudgets.filter(b => b.status === 'Active').length;
  const pendingBudgets = filteredBudgets.filter(b => b.status === 'Submitted').length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Budget Planning</h1>
            <p className="text-muted-foreground">Annual budgets and financial planning</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Budget</DialogTitle>
                  <DialogDescription>
                    Create a new budget plan for the specified period.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Budget Name *</Label>
                      <Input
                        id="name"
                        value={budgetFormData.name}
                        onChange={(e) => setBudgetFormData({...budgetFormData, name: e.target.value})}
                        placeholder="Annual Operating Budget 2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Budget Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={budgetFormData.budgetYear}
                        onChange={(e) => setBudgetFormData({...budgetFormData, budgetYear: parseInt(e.target.value)})}
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={budgetFormData.description}
                      onChange={(e) => setBudgetFormData({...budgetFormData, description: e.target.value})}
                      placeholder="Budget description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedStartDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedStartDate ? format(selectedStartDate, "PPP") : "Pick start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedStartDate}
                            onSelect={(date) => {
                              setSelectedStartDate(date);
                              if (date) {
                                setBudgetFormData({...budgetFormData, startDate: date.toISOString().split('T')[0]});
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedEndDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedEndDate ? format(selectedEndDate, "PPP") : "Pick end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedEndDate}
                            onSelect={(date) => {
                              setSelectedEndDate(date);
                              if (date) {
                                setBudgetFormData({...budgetFormData, endDate: date.toISOString().split('T')[0]});
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalBudget">Total Budget (₦) *</Label>
                      <Input
                        id="totalBudget"
                        type="number"
                        step="0.01"
                        value={budgetFormData.totalBudget}
                        onChange={(e) => setBudgetFormData({...budgetFormData, totalBudget: e.target.value})}
                        placeholder="100000.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quarter">Quarter (Optional)</Label>
                      <Select value={budgetFormData.budgetQuarter} onValueChange={(value) => setBudgetFormData({...budgetFormData, budgetQuarter: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quarter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Full Year</SelectItem>
                          <SelectItem value="1">Q1 (Jan-Mar)</SelectItem>
                          <SelectItem value="2">Q2 (Apr-Jun)</SelectItem>
                          <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                          <SelectItem value="4">Q4 (Oct-Dec)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={budgetFormData.notes}
                      onChange={(e) => setBudgetFormData({...budgetFormData, notes: e.target.value})}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetBudgetForm();}}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBudget} disabled={!budgetFormData.name || !budgetFormData.totalBudget || !budgetFormData.startDate || !budgetFormData.endDate}>
                    Add Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦ {totalBudgeted.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                {filteredBudgets.length} budgets
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
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBudgets}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgetCategories.length}</div>
              <p className="text-xs text-muted-foreground">
                Available categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Budget Year</Label>
                <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search budgets..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budgets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Budgets</CardTitle>
            <CardDescription>
              All budget plans and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBudgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{budget.name}</p>
                        {budget.description && (
                          <p className="text-sm text-muted-foreground">{budget.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{budget.budgetYear}</TableCell>
                    <TableCell>
                      {budget.budgetQuarter
                        ? `Q${budget.budgetQuarter}`
                        : `${new Date(budget.startDate).toLocaleDateString()} - ${new Date(budget.endDate).toLocaleDateString()}`
                      }
                    </TableCell>
                    <TableCell>₦ {budget.totalBudget.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant={
                        budget.status === 'Approved' ? 'default' :
                        budget.status === 'Active' ? 'default' :
                        budget.status === 'Submitted' ? 'secondary' :
                        budget.status === 'Draft' ? 'outline' : 'outline'
                      }>
                        {budget.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openItemsDialog(budget.id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {budget.status === 'Draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSubmitBudget(budget.id)}
                          >
                            Submit
                          </Button>
                        )}
                        {budget.status === 'Submitted' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveBudget(budget.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredBudgets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No budgets found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Budget Dialog */}
        <Dialog open={!!editingBudget} onOpenChange={(open) => !open && setEditingBudget(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
              <DialogDescription>
                Modify the budget details.
              </DialogDescription>
            </DialogHeader>
            {/* Same form fields as add dialog */}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Budget Name *</Label>
                  <Input
                    id="edit-name"
                    value={budgetFormData.name}
                    onChange={(e) => setBudgetFormData({...budgetFormData, name: e.target.value})}
                    placeholder="Annual Operating Budget 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Budget Year *</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={budgetFormData.budgetYear}
                    onChange={(e) => setBudgetFormData({...budgetFormData, budgetYear: parseInt(e.target.value)})}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={budgetFormData.description}
                  onChange={(e) => setBudgetFormData({...budgetFormData, description: e.target.value})}
                  placeholder="Budget description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Budget (₦) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={budgetFormData.totalBudget}
                    onChange={(e) => setBudgetFormData({...budgetFormData, totalBudget: e.target.value})}
                    placeholder="100000.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quarter (Optional)</Label>
                  <Select value={budgetFormData.budgetQuarter} onValueChange={(value) => setBudgetFormData({...budgetFormData, budgetQuarter: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Full Year</SelectItem>
                      <SelectItem value="1">Q1 (Jan-Mar)</SelectItem>
                      <SelectItem value="2">Q2 (Apr-Jun)</SelectItem>
                      <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                      <SelectItem value="4">Q4 (Oct-Dec)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={budgetFormData.notes}
                  onChange={(e) => setBudgetFormData({...budgetFormData, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {setEditingBudget(null); resetBudgetForm();}}>
                Cancel
              </Button>
              <Button onClick={handleEditBudget} disabled={!budgetFormData.name || !budgetFormData.totalBudget}>
                Update Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Budget Items Dialog */}
        <Dialog open={isItemsDialogOpen} onOpenChange={setIsItemsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Budget Items</DialogTitle>
              <DialogDescription>
                Manage budget items and allocations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Budget Items</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Planned Amount</TableHead>
                    <TableHead>Allocated Amount</TableHead>
                    <TableHead>Actual Spent</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetItems.map((item) => {
                    const variance = item.allocatedAmount - item.actualSpent;
                    const variancePercent = item.allocatedAmount > 0 ? (variance / item.allocatedAmount) * 100 : 0;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          {budgetCategories.find(c => c.id === item.budgetCategoryId)?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>RM {item.plannedAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>RM {item.allocatedAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>RM {item.actualSpent.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "font-medium",
                            variance >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {variance >= 0 ? '+' : ''}RM {variance.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                            ({variancePercent.toFixed(1)}%)
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {budgetItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No budget items yet. Add items to track expenses against this budget.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
