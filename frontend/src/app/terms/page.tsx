import type { Metadata } from "next";
import TermsAccordion from "@/components/client/TermsAccordion";

export const metadata: Metadata = {
  title: "Terms and Conditions | English with Gaven",
  description:
    "Terms and Conditions for English with Gaven. Learn about payment terms, refund policy, cancellation policy, and user responsibilities.",
  keywords:
    "terms of service, terms and conditions, English lessons policy, refund policy, cancellation policy",
};

export default function Terms() {
  const termsSections = [
    {
      title: "Introduction and Agreement to Terms",
      content:
        "By using this website, you agree to our terms and conditions. This document outlines key responsibilities and rights for both parties.",
    },
    {
      title: "Eligibility and User Responsibilities",
      content:
        "Users must be over 18 or have parental consent if underage. Users are responsible for providing accurate information and maintaining account security. This includes using a strong password and avoiding unauthorized access.",
    },
    {
      title: "Payment Terms and Refund Policy",
      content: (
        <>
          <p className="mb-3">
            All payments, cancellation terms, and refund policies are detailed
            here.
          </p>

          <div className="mt-4">
            <strong className="block mb-2">Payment Terms:</strong>
            <p>
              Lessons will be billed on a monthly basis in USD. Lessons will not
              begin until payment is confirmed, even if they are already
              scheduled.
            </p>
          </div>

          <div className="mt-4">
            <strong className="block mb-2">Cancellation Terms:</strong>
            <p className="mb-3">
              Lessons can be cancelled by either party up to 1 hour before the
              scheduled time. To ensure timely processing, a cancellation
              request email should be sent at least 2 hours in advance.
            </p>

            <div className="mt-3">
              <strong className="block mb-2">Cancellation by Student:</strong>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  If a student cancels a lesson before 1 hour of the scheduled
                  time, it will be rescheduled for the next available date.
                </li>
                <li>
                  However, if a student cancels within 1 hour of the scheduled
                  time or after the lesson has started, they will be charged the
                  full amount for the lesson.
                </li>
              </ul>
            </div>

            <div className="mt-3">
              <strong className="block mb-2">Cancellation by Tutor:</strong>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  If a tutor cancels a lesson before 1 hour of the scheduled
                  time, it will be rescheduled for the next available date.
                </li>
                <li>
                  In cases where a tutor cancels within 1 hour of the scheduled
                  time or after the lesson has started, they will provide two
                  make-up lessons on the next available dates.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <strong className="block mb-2">Refund Policy:</strong>
            <p>
              Lessons cannot be refunded but can be rescheduled for the next
              available date in accordance with our cancellation terms. The only
              exception for a refund is when a student cancels all remaining
              lessons with the intention of discontinuing their lessons. In such
              cases, the student will receive a full refund for any uncompleted
              lessons scheduled for the month.
            </p>
          </div>
        </>
      ),
    },
    {
      title: "Disclaimers and Limitation of Liability",
      content:
        "We are not responsible for technical issues or learning outcomes. Liability is limited to the maximum extent allowed by law.",
    },
  ];

  return (
    <main>
      <section className="mt-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary-dark pb-3">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-700">
            Read our terms of service including payment terms, refund policy,
            and cancellation policy
          </p>
        </div>
      </section>

      <TermsAccordion sections={termsSections} />
    </main>
  );
}
