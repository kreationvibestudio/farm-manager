"use client";

import { Mail, Phone, MessageSquare, Send, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Simulate form submission (you can replace this with actual API call)
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus({
                type: "success",
                message: "Thank you for contacting us! We'll get back to you soon.",
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <main className="p-6 space-y-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    Contact Us
                </h1>
                <p className="text-muted-foreground mt-1">
                    Have questions or need support? We're here to help.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Get in Touch</CardTitle>
                        <CardDescription>
                            Fill out the form and we'll respond as soon as possible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="subject" className="block text-sm font-medium">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="What is this regarding?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-medium">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us how we can help..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            {submitStatus && (
                                <div
                                    className={`p-4 rounded-lg ${
                                        submitStatus.type === "success"
                                            ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400"
                                    }`}
                                >
                                    {submitStatus.message}
                                </div>
                            )}
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? (
                                    <>
                                        <Send className="h-4 w-4 mr-2 animate-pulse" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                                Send us an email for general inquiries or support requests.
                            </p>
                            <p className="font-medium">support@farmmanager.com</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Phone Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                                Call us during business hours for immediate assistance.
                            </p>
                            <p className="font-medium">+234 (0) XXX XXX XXXX</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Monday - Friday: 8:00 AM - 5:00 PM
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Office Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                                Visit us at our office.
                            </p>
                            <p className="font-medium">
                                123 Plantation Road<br />
                                Oil Palm Estate<br />
                                Nigeria
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                We typically respond to inquiries within 24-48 hours during business days. 
                                For urgent matters, please call our phone support line.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
