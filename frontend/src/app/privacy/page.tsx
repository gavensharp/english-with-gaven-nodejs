import type { Metadata } from "next";
import PrivacyAccordion from "@/components/client/PrivacyAccordion";

export const metadata: Metadata = {
  title: "Privacy Policy | English with Gaven",
  description:
    "Learn how English with Gaven protects your personal information and educational data. GDPR compliant privacy policy.",
  keywords:
    "privacy policy, data protection, user privacy, English with Gaven, GDPR compliance",
};

export default function Privacy() {
  const privacySections = [
    {
      title: "Introduction and Purpose",
      content:
        "Our Privacy Policy outlines how we collect, use, and safeguard user data. We ensure compliance with all relevant data protection laws, providing a secure environment for our users.",
    },
    {
      title: "Data Collection and Types of Information Gathered",
      content: (
        <>
          <p className="mb-3">
            We collect personal information, usage data, and educational
            information to enhance our services and provide a better user
            experience. The specific types of information we gather include:
          </p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              Personal Information: This includes details such as your name,
              email address, and photo.
            </li>
            <li>
              Usage Data: We track how users interact with our platform,
              including frequency and purpose of use.
            </li>
            <li>
              Educational Information: This may encompass data on user learning
              habits, English proficiency level, or other relevant educational
              metrics.
            </li>
          </ol>
          <p className="mt-3">
            The primary purpose of collecting this data is to refine the
            accuracy and effectiveness of our services.
          </p>
        </>
      ),
    },
    {
      title: "Sharing and Disclosure of Information",
      content:
        "We are committed to maintaining the confidentiality of user information and will never share it with any external parties outside of our tutoring service.",
    },
    {
      title: "User Rights Regarding Personal Data",
      content:
        "Users can request access, correction, deletion, or transfer of their personal data in accordance with relevant data protection laws.",
    },
  ];

  return (
    <main>
      {/* Hero Section - Server-rendered */}
      <section className="mt-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary-dark pb-3">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700">
            Learn how we collect, use, and protect your personal information
          </p>
        </div>
      </section>

      {/* Privacy Accordion - Client component */}
      <PrivacyAccordion sections={privacySections} />
    </main>
  );
}
