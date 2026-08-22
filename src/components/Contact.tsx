import { person } from "@/lib/content";

const links = [
  { label: "Email", value: person.email, href: `mailto:${person.email}` },
  { label: "LinkedIn", value: "/in/marco-quantrill", href: person.linkedin },
  { label: "GitHub", value: "@MQuantrillC", href: person.github },
  { label: "WhatsApp", value: "+51 986 932 487", href: person.whatsapp },
];

export default function Contact() {
  return (
    <footer id="contact" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="rule-thick pt-3 flex justify-between type-label">
        <h2>Get in touch</h2>
        <span>{person.location}</span>
      </div>

      <a
        href={`mailto:${person.email}`}
        className="group block mt-10 type-mega break-words hover:text-accent transition-colors"
      >
        Say
        <br />
        hello
        <span className="text-accent group-hover:text-ink transition-colors">.</span>
      </a>

      <ul className="mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <li key={l.label} className="rule pt-3">
            <span className="type-label text-ink-soft block">{l.label}</span>
            <a
              href={l.href}
              {...(l.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="mt-0.5 inline-flex items-center min-h-11 text-lg break-words hover:text-accent transition-colors"
            >
              {l.value}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-16 rule pt-3 type-label text-ink-soft">
        &copy; {new Date().getFullYear()} {person.name} &#183; Built with Next.js
      </p>
    </footer>
  );
}
