"use client";

import { HelpCircle, BookOpen, FileText, Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DocumentationPage() {
    return (
        <main className="p-6 space-y-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    Documentation
                </h1>
                <p className="text-muted-foreground mt-1">
                    Everything you need to know about FarmManager platform.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        What is FarmManager?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        FarmManager is a comprehensive farm management platform designed specifically for oil palm plantations and mills. 
                        It helps you track deliverables, manage inventory, monitor vehicles, coordinate staff, and maintain detailed records 
                        of all farm operations in one centralized system.
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

                <Card>
                    <CardHeader>
                        <CardTitle>What are the main features of FarmManager?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">📊 Dashboard</h3>
                            <p className="text-sm text-muted-foreground">
                                Get a real-time overview of your plantation operations, including harvest summaries, 
                                low stock alerts, active vehicles, and key performance metrics.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">🌴 Harvest & Deliverables</h3>
                            <p className="text-sm text-muted-foreground">
                                Track daily harvest logs, record Fresh Fruit Bunch (FFB) quantities, monitor oil extraction rates, 
                                and manage all deliverables from field to mill.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">📦 Inventory Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage consumables like fertilizers, herbicides, fuel, spare parts, and tools. Set low stock alerts, 
                                track usage, and maintain optimal inventory levels.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">🚜 Fleet & Vehicles</h3>
                            <p className="text-sm text-muted-foreground">
                                Monitor your vehicle fleet including tractors, trucks, and motorcycles. Track vehicle status, 
                                assign drivers, schedule maintenance, and manage vehicle records.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">📍 Vehicle Tracking</h3>
                            <p className="text-sm text-muted-foreground">
                                Real-time GPS tracking of your vehicles on an interactive map. Monitor vehicle locations, 
                                routes, and movement patterns.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">👥 Staff Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage your plantation staff members, their roles (Manager, Supervisor, Driver, Worker), 
                                contact information, and track staff assignments.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">🔧 Farm Maintenance</h3>
                            <p className="text-sm text-muted-foreground">
                                Log maintenance activities, track maintenance schedules, record activities by block, 
                                and maintain detailed maintenance history for your plantation.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">📋 Audit Logs</h3>
                            <p className="text-sm text-muted-foreground">
                                Complete audit trail of all system activities including logins, logouts, data changes, 
                                and user actions for compliance and security.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How do I track harvest and deliverables?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Navigate to the "Harvest & Deliverables" section from the sidebar. You can:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Record daily harvest logs with FFB quantities</li>
                            <li>Track harvest by block or area</li>
                            <li>Monitor oil extraction rates</li>
                            <li>View harvest history and trends</li>
                            <li>Export harvest data for reporting</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How does inventory management work?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            The Inventory Management system allows you to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Add inventory items with categories (Fertilizer, Herbicide, Fuel, Spare Parts, Tools, Other)</li>
                            <li>Set minimum stock levels for automatic alerts</li>
                            <li>Add or subtract stock quantities as items are used or restocked</li>
                            <li>View low stock alerts on the dashboard</li>
                            <li>Track inventory value and usage patterns</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How do I manage my vehicle fleet?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            In the Fleet & Vehicles section, you can:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Add new vehicles (Tractors, Trucks, Motorcycles, Other)</li>
                            <li>Edit vehicle information and status</li>
                            <li>Update vehicle status (Active, Maintenance, Out of Service)</li>
                            <li>Assign drivers to vehicles</li>
                            <li>Track maintenance schedules</li>
                            <li>View real-time GPS location in the Vehicle Tracking section</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How does GPS tracking work?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Vehicle Tracking provides real-time location monitoring:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Select a vehicle from the dropdown to view its location</li>
                            <li>See vehicle status indicators (Active/Inactive)</li>
                            <li>View vehicles on an interactive map</li>
                            <li>GPS data can be acquired through GPS trackers installed in vehicles or via mobile app</li>
                            <li>Track movement patterns and routes</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How do I manage staff members?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Staff Management allows you to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Add new staff members with their roles and contact information</li>
                            <li>Edit staff details</li>
                            <li>Remove duplicate staff entries automatically</li>
                            <li>View staff by role (Manager, Supervisor, Driver, Worker)</li>
                            <li>Track staff assignments to vehicles and activities</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>What are audit logs and why are they important?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Audit logs provide a complete record of all system activities:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Track all user logins and logouts</li>
                            <li>Record all CREATE, UPDATE, and DELETE operations</li>
                            <li>Show who made changes and when</li>
                            <li>Display meaningful resource names and details (not just IDs)</li>
                            <li>Export audit logs for compliance and reporting</li>
                            <li>Filter by action type, user, or resource</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>How do I add or update inventory items?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            To manage inventory:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Go to the Inventory Management page</li>
                            <li>Click "Add New Item" to create a new inventory item</li>
                            <li>Fill in the item name, category, quantity, unit, and minimum level</li>
                            <li>Use the "+" or "-" buttons on items to adjust stock quantities</li>
                            <li>Items with quantities below minimum level will show low stock alerts</li>
                        </ol>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Can I export data from the platform?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Yes! The Audit Logs section allows you to export audit trail data as CSV files. 
                            This feature may be expanded to other sections in future updates. Export functionality 
                            helps with reporting, compliance, and data analysis.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Is my data secure?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Yes, FarmManager includes comprehensive security features:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Secure authentication with session management</li>
                            <li>All API routes are protected and require authentication</li>
                            <li>Complete audit trail of all user actions</li>
                            <li>Soft delete functionality to preserve data history</li>
                            <li>Row-level security in the database</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>What should I do if I need help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            If you need assistance or have questions:
                        </p>
                        <div className="flex gap-4">
                            <Link href="/contact">
                                <Button>
                                    Contact Support
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
