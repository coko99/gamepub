import { MapPin, Phone } from "lucide-react";
import { contactContent, getContactLinks, siteConfig } from "@/content/site";
import { ScrollReveal } from "./ui/ScrollReveal";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.71c-.07 3.011-.138 8.625 5.403 10.149v2.016s-.037.905.564.605c.602-.301 3.23-1.934 4.438-2.956.986.146 2.044.222 3.125.228 3.718.018 6.449-.956 8.015-3.228 1.665-2.424 1.531-5.648 1.494-6.628-.037-.98-.193-3.316-1.329-5.043-1.424-2.144-3.868-3.088-6.282-3.377-.553-.066-1.093-.1-1.582-.114zm.057 1.807c.048 0 .098 0 .148.002 2.246.135 4.262.966 5.392 2.668 1.003 1.512 1.127 3.567 1.161 4.458.034.891.148 3.787-1.256 5.831-1.307 1.905-3.604 2.715-6.978 2.7-.881-.004-1.855-.074-2.825-.22-.605-.096-1.22.148-1.656.464-.413.298-2.009 1.364-2.509 1.707-.094.063-.201.094-.301.094-.248 0-.416-.248-.416-.248l-.003-3.483c-4.753-1.303-4.548-6.218-4.488-8.925.059-2.707.578-4.876 2.015-6.315C4.898 1.444 8.488 1.182 11.455 1.81z" />
    </svg>
  );
}

type ContactCardProps = {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  icon: React.ReactNode;
  hoverBorder: string;
  iconBg: string;
};

function ContactCard({
  href,
  label,
  value,
  external,
  icon,
  hoverBorder,
  iconBg,
}: ContactCardProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`glass-card group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 ${hoverBorder}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#B8B8C8]">{label}</p>
        <p className="truncate font-semibold text-white">{value}</p>
      </div>
    </a>
  );
}

export function Contact() {
  const links = getContactLinks();

  const cards: ContactCardProps[] = [
    {
      href: links.whatsapp,
      label: contactContent.cards.whatsapp,
      value: siteConfig.phone,
      external: true,
      icon: <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />,
      hoverBorder: "hover:border-[#25D366]/40",
      iconBg: "bg-[#25D366]/10",
    },
    {
      href: links.viber,
      label: contactContent.cards.viber,
      value: siteConfig.phone,
      icon: <ViberIcon className="h-5 w-5 text-[#7360F2]" />,
      hoverBorder: "hover:border-[#7360F2]/40",
      iconBg: "bg-[#7360F2]/10",
    },
    {
      href: links.tel,
      label: contactContent.cards.phone,
      value: siteConfig.phone,
      icon: <Phone className="h-5 w-5 text-[#00E5FF]" />,
      hoverBorder: "hover:border-[#00E5FF]/40",
      iconBg: "bg-[#00E5FF]/10",
    },
    {
      href: siteConfig.instagramUrl,
      label: contactContent.cards.instagram,
      value: siteConfig.instagram,
      external: true,
      icon: <InstagramIcon className="h-5 w-5 text-[#FF2BD6]" />,
      hoverBorder: "hover:border-[#FF2BD6]/40",
      iconBg: "bg-[#FF2BD6]/10",
    },
    {
      href: siteConfig.mapLink,
      label: contactContent.cards.location,
      value: siteConfig.location,
      external: true,
      icon: <MapPin className="h-5 w-5 text-[#6C2DFF]" />,
      hoverBorder: "hover:border-[#6C2DFF]/40",
      iconBg: "bg-[#6C2DFF]/10",
    },
  ];

  return (
    <section id="kontakt" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[#080816]" />
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6C2DFF]/15 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="font-gaming mb-4 inline-block text-xs tracking-[0.2em] text-[#00E5FF] uppercase">
            Kontakt
          </span>
          <h2 className="font-heading text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
            {contactContent.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#B8B8C8] md:text-lg">
            {contactContent.description}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mx-auto mt-12 max-w-2xl space-y-4">
          {cards.map((card) => (
            <ContactCard key={card.label} {...card} />
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
