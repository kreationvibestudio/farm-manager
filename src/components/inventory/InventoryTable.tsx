"use client";

import { InventoryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveUp, MoveDown, AlertTriangle, Package, Edit, Trash2 } from "lucide-react";

interface InventoryTableProps {
    items: InventoryItem[];
    onAddStock: (item: InventoryItem) => void;
    onSubtractStock: (item: InventoryItem) => void;
    onEdit: (item: InventoryItem) => void;
    onDelete: (id: string) => void;
}

export function InventoryTable({ items, onAddStock, onSubtractStock, onEdit, onDelete }: InventoryTableProps) {
    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            <th className="p-4">Item Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Stock Level</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Last Updated</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    No items in inventory. Add your first item!
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => {
                                const isLow = item.quantity <= item.minLevel;
                                return (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-medium text-foreground">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Package className="h-4 w-4" />
                                                </div>
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{item.category}</td>
                                        <td className="p-4 font-medium">
                                            {item.quantity} <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>
                                        </td>
                                        <td className="p-4">
                                            {isLow ? (
                                                <Badge variant="destructive" className="gap-1 pl-1.5">
                                                    <AlertTriangle className="h-3 w-3" /> Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                                                    In Stock
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-4 text-muted-foreground">{new Date(item.lastUpdated).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => onAddStock(item)}
                                                    title="Add stock"
                                                >
                                                    <MoveUp className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => onSubtractStock(item)}
                                                    title="Remove stock"
                                                >
                                                    <MoveDown className="h-4 w-4 text-red-500" />
                                                </Button>
                                                <div className="h-4 w-[1px] bg-border mx-1" />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => onEdit(item)}
                                                    title="Edit item"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => onDelete(item.id)}
                                                    title="Delete item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
