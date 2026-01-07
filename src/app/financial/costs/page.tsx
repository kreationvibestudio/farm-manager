"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { CalendarIcon, Plus, Filter, Download, Edit, Trash2, CheckCircle, Clock, DollarSign, Shield } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { CostEntry, CostCategory } from "@/types";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useSession } from "next-auth/react";

export default function CostTrackingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Check if user is admin
  const isAdmin = (session?.user as any)?.role === 'Admin' || 
                  session?.user?.name === 'Admin User' || 
                  (session?.user?.email && session.user.email.includes('admin'));
  const {
    costEntries,
    costCategories,
    harvestLogs,
    fetchCostEntries,
    fetchCostCategories,
    fetchHarvestLogs,
    addCostEntry,
    updateCostEntry,
    deleteCostEntry,
    approveCostEntry,
    isLoading
  } = useAppStore();

  const [filters, setFilters] = useState({
    categoryId: "",
    startDate: "",
    endDate: "",
    search: ""
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CostEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Form state
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    description: "",
    dateIncurred: "",
    supplierName: "",
    quantity: "",
    unit: "",
    blockId: "",
    notes: ""
  });

  // Redirect non-admins
  useEffect(() => {
    if (session && !isAdmin) {
      router.push('/');
    }
  }, [session, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchCostEntries(filters);
      fetchCostCategories();
      if (harvestLogs.length === 0) {
        fetchHarvestLogs();
      }
    }
  }, [fetchCostEntries, fetchCostCategories, fetchHarvestLogs, filters, isAdmin, harvestLogs.length]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>
              This section is restricted to administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddCostEntry = async () => {
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return;
    }

    try {
      await addCostEntry({
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        currency: "NGN",
        description: formData.description,
        dateIncurred: formData.dateIncurred,
        supplierName: formData.supplierName || undefined,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        unit: formData.unit || undefined,
        blockId: formData.blockId || undefined,
        notes: formData.notes || undefined,
        createdBy: session.user.id,
      });

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add cost entry:", error);
    }
  };

  const handleEditCostEntry = async () => {
    if (!editingEntry) return;

    try {
      await updateCostEntry(editingEntry.id, {
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        currency: "NGN",
        description: formData.description,
        dateIncurred: formData.dateIncurred,
        supplierName: formData.supplierName || undefined,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        unit: formData.unit || undefined,
        blockId: formData.blockId || undefined,
        notes: formData.notes || undefined,
      });

      setEditingEntry(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update cost entry:", error);
    }
  };

  const handleDeleteCostEntry = async (id: string) => {
    if (confirm("Are you sure you want to delete this cost entry?")) {
      try {
        await deleteCostEntry(id);
      } catch (error) {
        console.error("Failed to delete cost entry:", error);
      }
    }
  };

  const handleApproveCostEntry = async (id: string) => {
    try {
      await approveCostEntry(id);
    } catch (error) {
      console.error("Failed to approve cost entry:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      amount: "",
      description: "",
      dateIncurred: "",
      supplierName: "",
      quantity: "",
      unit: "",
      blockId: "",
      notes: ""
    });
    setSelectedDate(undefined);
  };

  const openEditDialog = (entry: CostEntry) => {
    setEditingEntry(entry);
    setFormData({
      categoryId: entry.categoryId,
      amount: entry.amount.toString(),
      description: entry.description,
      dateIncurred: entry.dateIncurred,
      supplierName: entry.supplierName || "",
      quantity: entry.quantity?.toString() || "",
      unit: entry.unit || "",
      blockId: entry.blockId || "",
      notes: entry.notes || ""
    });
    setSelectedDate(new Date(entry.dateIncurred));
  };

  const filteredEntries = costEntries.filter(entry => {
    if (filters.search && !entry.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalCosts = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <Breadcrumb items={[
          { label: "Financial Management", href: "/financial" },
          { label: "Cost Tracking" }
        ]} className="mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Cost Tracking</h1>
            <p className="text-muted-foreground">Track and manage all operational expenses</p>
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
                  Add Cost Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Cost Entry</DialogTitle>
                  <DialogDescription>
                    Record a new operational expense or cost.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.categoryId || ""} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {costCategories.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              No categories available. Please add cost categories first.
                            </div>
                          ) : (
                            costCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₦) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the expense..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date Incurred *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              if (date) {
                                setFormData({...formData, dateIncurred: date.toISOString().split('T')[0]});
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={formData.supplierName}
                        onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                        placeholder="Supplier name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="Quantity"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        placeholder="kg, L, units"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="block">Block/Area</Label>
                      <Select value={formData.blockId || "none"} onValueChange={(value) => setFormData({...formData, blockId: value === "none" ? "" : value})}>
                        <SelectTrigger id="block">
                          <SelectValue placeholder="Select block...">
                            {formData.blockId || "Select block..."}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {[...new Set(harvestLogs.map(log => log.blockId).filter(Boolean))].sort().map((block) => (
                            <SelectItem key={block} value={block}>
                              {block}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm();}}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCostEntry} disabled={!formData.categoryId || !formData.amount || !formData.description || !formData.dateIncurred}>
                    Add Cost Entry
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
              <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦ {totalCosts.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                {filteredEntries.length} entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredEntries.filter(e => !e.approvedAt).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredEntries.filter(e => e.approvedAt).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Approved entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{costCategories.length}</div>
              <p className="text-xs text-muted-foreground">
                Active categories
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
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={filters.categoryId} onValueChange={(value) => setFilters({...filters, categoryId: value === "all" ? "" : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {costCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search descriptions..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Entries</CardTitle>
            <CardDescription>
              All recorded operational expenses and costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.dateIncurred).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {costCategories.find(c => c.id === entry.categoryId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.supplierName || '-'}</TableCell>
                    <TableCell>₦ {entry.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant={entry.approvedAt ? "default" : "secondary"}>
                        {entry.approvedAt ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!entry.approvedAt && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveCostEntry(entry.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCostEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No cost entries found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Cost Entry</DialogTitle>
              <DialogDescription>
                Modify the cost entry details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Same form fields as add dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.categoryId || ""} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCategories.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No categories available. Please add cost categories first.
                        </div>
                      ) : (
                        costCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount (₦) *</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the expense..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Incurred *</Label>
                  <Input
                    type="date"
                    value={formData.dateIncurred}
                    onChange={(e) => setFormData({...formData, dateIncurred: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Input
                    id="edit-supplier"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                    placeholder="Supplier name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="Quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Input
                    id="edit-unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder="kg, L, units"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-block">Block/Area</Label>
                  <Select value={formData.blockId || "none"} onValueChange={(value) => setFormData({...formData, blockId: value === "none" ? "" : value})}>
                    <SelectTrigger id="edit-block">
                      <SelectValue placeholder="Select block...">
                        {formData.blockId || "Select block..."}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {[...new Set(harvestLogs.map(log => log.blockId).filter(Boolean))].sort().map((block) => (
                        <SelectItem key={block} value={block}>
                          {block}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {setEditingEntry(null); resetForm();}}>
                Cancel
              </Button>
              <Button onClick={handleEditCostEntry} disabled={!formData.categoryId || !formData.amount || !formData.description || !formData.dateIncurred}>
                Update Cost Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
