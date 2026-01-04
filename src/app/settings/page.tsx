import { Settings, User, Bell, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <main className="p-6 space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your public profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-medium">John Doe</h3>
                                <p className="text-sm text-muted-foreground">john.doe@plantation.com</p>
                            </div>
                            <Button variant="outline" className="ml-auto">Edit Profile</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
                            <CardDescription>Configure how you receive alerts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Email Alerts</span>
                                    <span className="text-primary font-medium">On</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>In-App Notifications</span>
                                    <span className="text-primary font-medium">On</span>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full mt-4 justify-start px-0 text-primary">Manage Notifications</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security</CardTitle>
                            <CardDescription>Protect your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Two-Factor Auth</span>
                                    <span className="text-muted-foreground">Not Set</span>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full mt-4 justify-start px-0 text-primary">Change Password</Button>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Help & Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Need help with the platform? Check our documentation or contact support.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <Link href="/documentation">
                                <Button variant="outline">Documentation</Button>
                            </Link>
                            <Link href="/contact">
                                <Button>Contact Support</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
