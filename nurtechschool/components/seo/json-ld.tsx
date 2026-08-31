import { configs } from "@/lib/constants";

interface JsonLdProps {
  siteName?: string;
  description?: string;
  logoUrl?: string;
}

export default function JsonLd({
  siteName = "SMP Islam Nurtech",
  description = "SMP Islam Nurtech adalah sekolah menengah pertama Islam unggulan dengan integrasi pendidikan karakter, tahfidz Al-Qur'an, dan teknologi digital.",
  logoUrl,
}: JsonLdProps) {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    configs.WEBSITE_URL ||
    "https://nurtechschool.id"
  ).replace(/\/$/, "");

  const fullLogoUrl = logoUrl
    ? logoUrl.startsWith("http")
      ? logoUrl
      : `${baseUrl}${logoUrl}`
    : `${baseUrl}/images/icon/logo1.svg`;

  const schoolSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${baseUrl}/#organization`,
    name: siteName,
    alternateName: ["Nurtech School", "SMP Islam Nurtech"],
    url: baseUrl,
    logo: fullLogoUrl,
    image: fullLogoUrl,
    description: description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
      addressLocality: "Indonesia",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: configs.WA_NUMBER ? `+${configs.WA_NUMBER}` : "+6282240386822",
      contactType: "customer service / admissions",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "English"],
    },
    sameAs: [
      "https://facebook.com/nurtechschool",
      "https://instagram.com/nurtechschool",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: siteName,
    description: description,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "id-ID",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
