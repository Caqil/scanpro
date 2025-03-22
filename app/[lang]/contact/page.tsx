"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, MapPin, PhoneCall, Send, InfoIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner";
// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setFormStatus("submitting")

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setFormStatus("success")
        toast.success("Message sent success", {
            description: `We've received your message and will get back to you soon.`,
          });
       
        form.reset()

        // Reset form status after 3 seconds
        setTimeout(() => {
          setFormStatus("idle")
        }, 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Contact form submission error:", error)
      setFormStatus("error")
      toast.error("Something went wrong", {
        description: `error instanceof Error ? error.message : "Failed to send your message. Please try again.`,
      });
      

      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus("idle")
      }, 3000)
    }
  }

  return (
    <div className="container max-w-6xl py-12 mx-auto px-4">
      <div className="mx-auto flex flex-col items-center text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30"
        >
          <Send className="h-8 w-8 text-blue-500" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Contact ScanPro
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-xl text-muted-foreground max-w-[700px]"
        >
          We're here to help! Reach out to us with any questions, feedback, or support inquiries.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Information */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:col-span-1 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:support@scanpro.cc"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    support@scanpro.cc
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+18005551234"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (800) 555-1234
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    123 PDF Street, Suite 456
                    <br />
                    Tech City, ST 12345
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
              <CardDescription>When we're available to help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-red-500">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} disabled={formStatus === "submitting"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                              disabled={formStatus === "submitting"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What can we help you with?"
                            {...field}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide detailed information about your inquiry"
                            className="min-h-[150px]"
                            {...field}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full relative" disabled={formStatus === "submitting"}>
                    <AnimatePresence mode="wait">
                      {formStatus === "idle" && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Send className="h-4 w-4 mr-2" /> Send Message
                        </motion.div>
                      )}

                      {formStatus === "submitting" && (
                        <motion.div
                          key="submitting"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                        </motion.div>
                      )}

                      {formStatus === "success" && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center text-green-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Message Sent!
                        </motion.div>
                      )}

                      {formStatus === "error" && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center text-red-500"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" /> Failed to Send
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              How long does it take to get a response?
            </h3>
            <p className="text-sm text-muted-foreground">
              We aim to respond to all inquiries within 24-48 business hours. During peak times, it may take up to 72
              hours.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I get support for a technical issue?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, our technical support team is available to help you with any issues you're experiencing with our PDF
              tools.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Do you offer phone support?
            </h3>
            <p className="text-sm text-muted-foreground">
              We provide phone support during our listed support hours. For immediate assistance, email is often the
              fastest way to get help.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is my personal information secure?
            </h3>
            <p className="text-sm text-muted-foreground">
              We take your privacy seriously. All communication is encrypted, and we never share your personal
              information with third parties.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

