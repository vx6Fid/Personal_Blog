"use client";

import React, { useState } from "react";
import {
  Send,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Coffee,
  ArrowUpRight,
} from "lucide-react";

const socialLinks = [
  {
    name: "Email",
    href: "mailto:tiwariachal059@gmail.com",
    icon: Mail,
    label: "tiwariachal059@gmail.com",
    color: "hover:text-red-400",
  },
  {
    name: "GitHub",
    href: "https://github.com/vx6Fid",
    icon: Github,
    color: "hover:text-gray-400",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/achaltiwari/",
    icon: Linkedin,
    color: "hover:text-blue-500",
  },
  {
    name: "Twitter",
    href: "https://x.com/vx6Fid",
    icon: Twitter,
    color: "hover:text-sky-400",
  },
  {
    name: "Buy Me a Coffee",
    href: "https://buymeacoffee.com/vx6fid",
    icon: Coffee,
    color: "hover:text-yellow-400",
  },
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ success: true, message: "Message sent." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || "Failed to send message.",
        });
      }
    } catch {
      setSubmitStatus({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-medium text-primary mb-2">Get in touch</h1>
      <p className="text-secondary mb-10">
        Have a question or want to work together? Drop me a message.
      </p>

      {/* Social links */}
      <div className="flex flex-col gap-2 mb-12">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between px-1 py-1.5 text-sm text-secondary transition-colors ${link.color}`}
          >
            <span className="flex items-center gap-2">
              <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              {link.label || link.name}
            </span>
          </a>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm text-secondary mb-1.5">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent border border-borders rounded-lg px-4 py-2.5 text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-secondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border border-borders rounded-lg px-4 py-2.5 text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-secondary mb-1.5">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full bg-transparent border border-borders rounded-lg px-4 py-2.5 text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors resize-none"
            placeholder="What's on your mind?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isSubmitting
            ? "bg-accent/10 text-accent/50 cursor-not-allowed"
            : "bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 hover:border-accent/50"
            }`}
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Sending..." : "Send message"}
        </button>

        {submitStatus && (
          <p
            className={`text-sm ${submitStatus.success ? "text-success" : "text-error"
              }`}
          >
            {submitStatus.message}
          </p>
        )}
      </form>

      <p className="mt-10 text-xs text-secondary">
        I usually reply within a day or two.
      </p>
    </div>
  );
}

export default ContactPage;
