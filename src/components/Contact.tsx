import { person } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n/config";

export default function Contact({ t }: { t: Dictionary["contact"] }) {
  const links = [
    { key: "email", value: person.email, href: `mailto:${person.email}` },
    { key: "linkedin", value: "/in/marco-quantrill", href: person.linkedin },
    { key: "github", value: "@MQuantrillC", href: person.github },
    { key: "whatsapp", value: "+51 986 932 487", href: person.whatsapp },
  ];

  return (
    <footer id="contact" className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <h2 className="sr-only">{t.heading}</h2>

      <a
        href={`mailto:${person.email}`}
        className="group block mt-10 type-sign break-words hover:text-accent transition-colors"
      >
        {t.say}
        <br />
        {t.hello}
        <span className="text-accent group-hover:text-ink transition-colors">.</span>
      </a>

      <ul className="mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <li key={l.key} className="rule pt-3">
            <span className="type-label text-ink-soft block">{t.labels[l.key]}</span>
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
        &copy; {new Date().getFullYear()} {person.name} &#183; {t.builtWith}
      </p>
    </footer>
  );
}
