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
import { CalendarIcon, Plus, Filter, Download, Edit, Trash2, CheckCircle, Clock, TrendingUp, DollarSign, Receipt } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { SalesRecord } from "@/types";
import { useSession } from "next-auth/react";

export default function SalesManagementPage() {
  const { data: session } = useSession();
  const {
    salesRecords,
    harvestLogs,
    addSalesRecord,
    updateSalesRecord,
    deleteSalesRecord,
    updatePaymentStatus,
    fetchSalesRecords,
    fetchHarvestLogs,
    isLoading
  } = useAppStore();

  const [filters, setFilters] = useState({
    buyerName: "",
    paymentStatus: "",
    productType: "",
    startDate: "",
    endDate: "",
    search: ""
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalesRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Form state
  const [formData, setFormData] = useState({
    saleDate: "",
    buyerName: "",
    buyerContact: "",
    productType: "FFB",
    quantitySold: "",
    unit: "kg",
    unitPrice: "",
    transportCost: "",
    transportSupplier: "",
    qualityGrade: "",
    moistureContent: "",
    foreignMatter: "",
    invoiceNumber: "",
    deliveryNote: "",
    notes: ""
  });

  useEffect(() => {
    fetchSalesRecords(filters);
    fetchHarvestLogs();
  }, [fetchSalesRecords, fetchHarvestLogs, filters]);

  const handleAddSalesRecord = async () => {
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Calculate total amount
      const quantity = parseFloat(formData.quantitySold);
      const unitPrice = parseFloat(formData.unitPrice);
      const transportCost = parseFloat(formData.transportCost || "0");
      const totalAmount = (quantity * unitPrice) + transportCost;

      await addSalesRecord({
        saleDate: formData.saleDate,
        buyerName: formData.buyerName,
        buyerContact: formData.buyerContact || undefined,
        productType: formData.productType as any,
        quantitySold: quantity,
        unit: formData.unit,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        currency: "MYR",
        transportCost: transportCost > 0 ? transportCost : undefined,
        transportSupplier: formData.transportSupplier || undefined,
        qualityGrade: formData.qualityGrade || undefined,
        moistureContent: formData.moistureContent ? parseFloat(formData.moistureContent) : undefined,
        foreignMatter: formData.foreignMatter ? parseFloat(formData.foreignMatter) : undefined,
        invoiceNumber: formData.invoiceNumber || undefined,
        deliveryNote: formData.deliveryNote || undefined,
        notes: formData.notes || undefined,
        createdBy: session.user.id,
      });

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add sales record:", error);
    }
  };

  const handleEditSalesRecord = async () => {
    if (!editingRecord) return;

    try {
      const quantity = parseFloat(formData.quantitySold);
      const unitPrice = parseFloat(formData.unitPrice);
      const transportCost = parseFloat(formData.transportCost || "0");
      const totalAmount = (quantity * unitPrice) + transportCost;

      await updateSalesRecord(editingRecord.id, {
        saleDate: formData.saleDate,
        buyerName: formData.buyerName,
        buyerContact: formData.buyerContact || undefined,
        productType: formData.productType as any,
        quantitySold: quantity,
        unit: formData.unit,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        currency: "MYR",
        transportCost: transportCost > 0 ? transportCost : undefined,
        transportSupplier: formData.transportSupplier || undefined,
        qualityGrade: formData.qualityGrade || undefined,
        moistureContent: formData.moistureContent ? parseFloat(formData.moistureContent) : undefined,
        foreignMatter: formData.foreignMatter ? parseFloat(formData.foreignMatter) : undefined,
        invoiceNumber: formData.invoiceNumber || undefined,
        deliveryNote: formData.deliveryNote || undefined,
        notes: formData.notes || undefined,
      });

      setEditingRecord(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update sales record:", error);
    }
  };

  const handleDeleteSalesRecord = async (id: string) => {
    if (confirm("Are you sure you want to delete this sales record?")) {
      try {
        await deleteSalesRecord(id);
      } catch (error) {
        console.error("Failed to delete sales record:", error);
      }
    }
  };

  const handlePaymentUpdate = async (id: string, paymentReceived: number, status: string) => {
    try {
      await updatePaymentStatus(id, paymentReceived, status);
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      saleDate: "",
      buyerName: "",
      buyerContact: "",
      productType: "FFB",
      quantitySold: "",
      unit: "kg",
      unitPrice: "",
      transportCost: "",
      transportSupplier: "",
      qualityGrade: "",
      moistureContent: "",
      foreignMatter: "",
      invoiceNumber: "",
      deliveryNote: "",
      notes: ""
    });
    setSelectedDate(undefined);
  };

  const openEditDialog = (record: SalesRecord) => {
    setEditingRecord(record);
    setFormData({
      saleDate: record.saleDate,
      buyerName: record.buyerName,
      buyerContact: record.buyerContact || "",
      productType: record.productType,
      quantitySold: record.quantitySold.toString(),
      unit: record.unit,
      unitPrice: record.unitPrice.toString(),
      transportCost: record.transportCost?.toString() || "",
      transportSupplier: record.transportSupplier || "",
      qualityGrade: record.qualityGrade || "",
      moistureContent: record.moistureContent?.toString() || "",
      foreignMatter: record.foreignMatter?.toString() || "",
      invoiceNumber: record.invoiceNumber || "",
      deliveryNote: record.deliveryNote || "",
      notes: record.notes || ""
    });
    setSelectedDate(new Date(record.saleDate));
  };

  const filteredRecords = salesRecords.filter(record => {
    if (filters.search && !record.buyerName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalRevenue = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  const pendingPayments = filteredRecords.filter(r => r.paymentStatus === 'Pending').length;
  const paidAmount = filteredRecords.reduce((sum, record) =>
    sum + (record.paymentStatus === 'Paid' ? record.totalAmount : record.paymentReceived), 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Revenue & Sales</h1>
            <p className="text-muted-foreground">Manage FFB sales and revenue tracking</p>
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
                  Add Sales Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Sales Record</DialogTitle>
                  <DialogDescription>
                    Record a new FFB or by-product sale.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyer">Buyer Name *</Label>
                      <Input
                        id="buyer"
                        value={formData.buyerName}
                        onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                        placeholder="Buyer company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyer-contact">Buyer Contact</Label>
                      <Input
                        id="buyer-contact"
                        value={formData.buyerContact}
                        onChange={(e) => setFormData({...formData, buyerContact: e.target.value})}
                        placeholder="Contact person/phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Product Type *</Label>
                      <Select value={formData.productType} onValueChange={(value) => setFormData({...formData, productType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FFB">FFB (Fresh Fruit Bunch)</SelectItem>
                          <SelectItem value="CPO">CPO (Crude Palm Oil)</SelectItem>
                          <SelectItem value="PK">PK (Palm Kernel)</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantitySold}
                        onChange={(e) => setFormData({...formData, quantitySold: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="tonne">tonne</SelectItem>
                          <SelectItem value="liter">liter</SelectItem>
                          <SelectItem value="units">units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit-price">Unit Price (RM) *</Label>
                      <Input
                        id="unit-price"
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sale Date *</Label>
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
                                setFormData({...formData, saleDate: date.toISOString().split('T')[0]});
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
                      <Label htmlFor="transport-cost">Transport Cost (RM)</Label>
                      <Input
                        id="transport-cost"
                        type="number"
                        step="0.01"
                        value={formData.transportCost}
                        onChange={(e) => setFormData({...formData, transportCost: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transport-supplier">Transport Supplier</Label>
                      <Input
                        id="transport-supplier"
                        value={formData.transportSupplier}
                        onChange={(e) => setFormData({...formData, transportSupplier: e.target.value})}
                        placeholder="Transport company"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quality-grade">Quality Grade</Label>
                      <Select value={formData.qualityGrade} onValueChange={(value) => setFormData({...formData, qualityGrade: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grade A">Grade A</SelectItem>
                          <SelectItem value="Grade B">Grade B</SelectItem>
                          <SelectItem value="Grade C">Grade C</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moisture">Moisture (%)</Label>
                      <Input
                        id="moisture"
                        type="number"
                        step="0.1"
                        max="100"
                        value={formData.moistureContent}
                        onChange={(e) => setFormData({...formData, moistureContent: e.target.value})}
                        placeholder="7.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foreign-matter">Foreign Matter (%)</Label>
                      <Input
                        id="foreign-matter"
                        type="number"
                        step="0.1"
                        max="100"
                        value={formData.foreignMatter}
                        onChange={(e) => setFormData({...formData, foreignMatter: e.target.value})}
                        placeholder="0.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice">Invoice Number</Label>
                      <Input
                        id="invoice"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                        placeholder="INV-2024-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery-note">Delivery Note</Label>
                      <Input
                        id="delivery-note"
                        value={formData.deliveryNote}
                        onChange={(e) => setFormData({...formData, deliveryNote: e.target.value})}
                        placeholder="DN-2024-001"
                      />
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
                  <Button onClick={handleAddSalesRecord} disabled={!formData.buyerName || !formData.quantitySold || !formData.unitPrice || !formData.saleDate}>
                    Add Sales Record
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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">RM {totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                {filteredRecords.length} sales records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">RM {paidAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">
                Collected payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Outstanding payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price/kg</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                RM {(filteredRecords.length > 0 ? filteredRecords.reduce((sum, r) => sum + r.unitPrice, 0) / filteredRecords.length : 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Average unit price
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
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label>Buyer Name</Label>
                <Input
                  placeholder="Search buyers..."
                  value={filters.buyerName}
                  onChange={(e) => setFilters({...filters, buyerName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={filters.paymentStatus} onValueChange={(value) => setFilters({...filters, paymentStatus: value === "all" ? "" : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={filters.productType} onValueChange={(value) => setFilters({...filters, productType: value === "all" ? "" : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All products</SelectItem>
                    <SelectItem value="FFB">FFB</SelectItem>
                    <SelectItem value="CPO">CPO</SelectItem>
                    <SelectItem value="PK">PK</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        {/* Sales Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Records</CardTitle>
            <CardDescription>
              All FFB and by-product sales transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.buyerName}</div>
                        {record.buyerContact && (
                          <div className="text-sm text-muted-foreground">{record.buyerContact}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.productType}</Badge>
                    </TableCell>
                    <TableCell>{record.quantitySold.toLocaleString()} {record.unit}</TableCell>
                    <TableCell>RM {record.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>RM {record.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant={
                        record.paymentStatus === 'Paid' ? 'default' :
                        record.paymentStatus === 'Partial' ? 'secondary' :
                        record.paymentStatus === 'Overdue' ? 'destructive' : 'outline'
                      }>
                        {record.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSalesRecord(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No sales records found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Sales Record</DialogTitle>
              <DialogDescription>
                Modify the sales record details.
              </DialogDescription>
            </DialogHeader>
            {/* Same form fields as add dialog - abbreviated for brevity */}
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-buyer">Buyer Name *</Label>
                  <Input
                    id="edit-buyer"
                    value={formData.buyerName}
                    onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                    placeholder="Buyer company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-buyer-contact">Buyer Contact</Label>
                  <Input
                    id="edit-buyer-contact"
                    value={formData.buyerContact}
                    onChange={(e) => setFormData({...formData, buyerContact: e.target.value})}
                    placeholder="Contact person/phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Product Type *</Label>
                  <Select value={formData.productType} onValueChange={(value) => setFormData({...formData, productType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FFB">FFB</SelectItem>
                      <SelectItem value="CPO">CPO</SelectItem>
                      <SelectItem value="PK">PK</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity *</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantitySold}
                    onChange={(e) => setFormData({...formData, quantitySold: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit-price">Unit Price (RM) *</Label>
                  <Input
                    id="edit-unit-price"
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sale Date *</Label>
                  <Input
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) => setFormData({...formData, saleDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-transport-cost">Transport Cost (RM)</Label>
                  <Input
                    id="edit-transport-cost"
                    type="number"
                    step="0.01"
                    value={formData.transportCost}
                    onChange={(e) => setFormData({...formData, transportCost: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {setEditingRecord(null); resetForm();}}>
                Cancel
              </Button>
              <Button onClick={handleEditSalesRecord} disabled={!formData.buyerName || !formData.quantitySold || !formData.unitPrice || !formData.saleDate}>
                Update Sales Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
