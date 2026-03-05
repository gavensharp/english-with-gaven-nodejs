import type { Metadata } from "next";
import FAQAccordion from "@/components/client/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | English with Gaven",
  description:
    "Find answers to frequently asked questions about English lessons, payment, scheduling, and more",
  keywords:
    "English lessons FAQ, online tutoring questions, English teacher FAQ, payment options, group lessons",
};

export default function FAQ() {
  const faqs = [
    {
      question: "What payment options are available?",
      answer:
        "PayPal and credit or debit card payments are available. The PayPal payment button is located on your profile page once you have logged in. Click on the 'Pay with PayPal' button to pay with your PayPal account, or continue as a guest on PayPal. You can pay with a credit or debit card via PayPal. More payment options will be added in the future.",
    },
    {
      question: "Can I choose a specific video call application?",
      answer:
        "Yes, Gaven will try to get set up on the video call application of your choice. Popular choices include Zoom, Google Meet, and Microsoft Teams. Otherwise, you can use the default video call application. Gaven will provide instructions on how to set up the video call application.",
    },
    {
      question: "Do we start with a free 10-minute video call?",
      answer:
        "Yes, once your lessons are scheduled and payment is completed, you will receive a free 10-minute video call. This is to set up the video call application and make sure everything is working. As well as an introduction to discuss learning goals. We will start working on these goals from the first lesson.",
    },
    {
      question: "Are group lessons available? How does it work?",
      answer:
        "Yes, group lessons are available! You can invite your friends or family to join you in the lesson, and the cost of the lesson will be the same. Keep in mind that students' benefit and progress from these lessons may vary depending on different English skill levels of students in a group lesson.",
    },
    {
      question: "What is Gaven's tutoring style?",
      answer:
        "To speak English fluently, you must practice speaking it as much as possible. This is true for any language: consistent practice is the key to improvement. Therefore, Gaven encourages students to speak English as much as possible, even if they make many mistakes. Gaven can assess a student's English skill level and provide targeted support to improve their weaknesses through engaging, interactive lessons.",
    },
    {
      question: "Is Gaven a learning specialist?",
      answer:
        "Yes, Gaven worked as a corporate learning and development manager in the USA. He was responsible for the training and development of employees from a diverse range of countries. This is why Gaven is excellent at tutoring English for career development. And since Gaven is a computer science major at the University of the People, he is a super tutor in academics as well!",
    },
    {
      question: "Can Gaven tutor English to kids?",
      answer:
        "Yes, Gaven has an eight-year-old daughter who is learning English with him. And he has tutored hundreds of kids on Cambly. Our children are the future; the better we teach them, the more successful they will become. Gaven can include school and life topics in his lessons to provide a holistic education for your child.",
    },
  ];

  return (
    <main>
      {/* Hero Section - Server-rendered */}
      <section className="mt-10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary-dark pb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-700">
            Find answers to common questions about English lessons with Gaven
          </p>
        </div>
      </section>

      {/* FAQ Accordion - Client component */}
      <FAQAccordion faqs={faqs} />
    </main>
  );
}
