"use client";

import React, { useState } from "react";
import { Send, Mail, Linkedin, Instagram, Twitter, Github } from "lucide-react";

export default function ContactPage() {
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Message sent successfully!",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || "Failed to send message",
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-primary mb-6">Contact Me</h1>

        <div className="bg-code/10 p-4 rounded-lg mb-8">
          <p className="text-accent flex items-start gap-2">
            <span className="text-secondary">$</span> Let's have a chat!
          </p>
          <div className="mt-4 space-y-3">
            <a
              href="mailto:tiwariachal059@gmail.com"
              className="flex underline items-center gap-3 text-secondary hover:text-accent transition-colors"
            >
              <Mail className="w-4 h-4" />
              tiwariachal059@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/achaltiwari/"
              target="blank"
              className="flex items-center gap-3 text-secondary hover:text-accent transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/vx6fid"
              target="blank"
              className="flex items-center gap-3 text-secondary hover:text-accent transition-colors"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
            <a
              href="https://x.com/vx6Fid"
              target="blank"
              className="flex items-center gap-3 text-secondary hover:text-accent transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
            <a
              href="https://github.com/vx6Fid"
              target="blank"
              className="flex items-center gap-3 text-secondary hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4" />
              Github
            </a>
          </div>
        </div>
      </div>
      <div className="bg-code/10 py-4 rounded-lg">
        <p className="text-accent flex items-start gap-2">
          <span className="text-secondary">$</span> Let's collaborate!
        </p>
      </div>
      {/* Contact Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-secondary mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-borders/10 border border-borders rounded px-4 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-secondary mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-borders/10 border border-borders rounded px-4 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm text-secondary mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full bg-borders/10 border border-borders rounded px-4 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Your message here..."
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-8 w-full flex items-center justify-center gap-2 
            bg-transparent text-accent border border-accent 
            px-6 py-3 rounded hover:bg-accent/10 hover:border-accent/80
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
            transition-colors duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>

      {/* Status message */}
      {submitStatus && (
        <p
          className={`mt-4 text-sm ${
            submitStatus.success ? "text-accent" : "text-error"
          }`}
        >
          {submitStatus.message}
        </p>
      )}

      {/* Footer Note */}
      <p className="mt-8 text-sm text-secondary">
        // I usually reply within a day or two.
      </p>
    </div>
  );
}
