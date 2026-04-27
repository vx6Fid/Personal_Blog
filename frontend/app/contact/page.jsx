import ContactClient from "@/components/ContactClient";

export const metadata = {
  title: "Contact | vx6Fid",
  description:
    "Get in touch with vx6Fid for collaboration, questions, or feedback.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | vx6Fid",
    description: "Reach out to vx6Fid via email or form. Let's connect.",
    url: "https://vx6fid.vercel.app/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
