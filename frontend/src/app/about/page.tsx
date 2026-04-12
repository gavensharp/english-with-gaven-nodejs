import Image from "next/image";
import type { Metadata } from "next";
// import CTAButton from "@/components/CTAButton";
import InfoButton from "@/components/InfoButton";

export const metadata: Metadata = {
  title: "About Gaven - Your Experienced English Teacher | English with Gaven",
  description:
    "Learn about Gaven, your experienced English tutor with over 20 years of teaching experience worldwide. TEFL certified with 2000+ students taught.",
  keywords:
    "English teacher, TEFL certified, online English lessons, English tutor, speaking English, English with Gaven",
  openGraph: {
    title:
      "About Gaven - Your Experienced English Teacher | English with Gaven",
    description:
      "TEFL certified English teacher with 20+ years experience. 2000+ students taught worldwide.",
    images: ["/site-images/logo.png"],
    url: "https://englishwithgaven.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Gaven - Your Experienced English Teacher",
    description: "TEFL certified English teacher with 20+ years experience",
    images: ["/site-images/logo.png"],
  },
};

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Hero Content */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-primary-dark pb-3 text-center">
                Hi, my name is Gaven!
              </h1>
              <p className="text-lg mb-4 text-center">
                I have taught English to people of all ages from all over the
                world, helping them improve their English skills.
              </p>
              <p className="text-lg mb-6 text-center">
                Let me help you improve your English today!
              </p>
              {/* CTA Button */}
              {/* <div className="text-center mt-12">
                <CTAButton />
              </div> */}
            </div>

            {/* Hero Video */}
            <div className="text-center mt-4">
              <div className="relative pb-[56.25%] rounded-[20px] overflow-hidden shadow-lg border-2 border-border">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/CctkrR7NkfY?si=jcK_XkKELvCzchGS"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Teaching Experience Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-primary-dark mb-12">
            Teaching Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Experience Card 1 */}
            <div className="card p-6 text-center h-full">
              <h3 className="text-xl font-bold mb-3">English in Thailand</h3>
              <span className="text-gray-500 block mb-3">2001-2002</span>
              <p className="text-gray-700">
                Taught English to kids aged 5 to 17 at an English language
                center and local schools.
              </p>
            </div>

            {/* Experience Card 2 */}
            <div className="card p-6 text-center h-full">
              <h3 className="text-xl font-bold mb-3">
                English on Cruise Ships
              </h3>
              <span className="text-gray-500 block mb-3">2010-2020</span>
              <p className="text-gray-700">
                Taught English to adults of various nationalities to improve
                safety and hospitality.
              </p>
            </div>

            {/* Experience Card 3 */}
            <div className="card p-6 text-center h-full">
              <h3 className="text-xl font-bold mb-3">English in Indonesia</h3>
              <span className="text-gray-500 block mb-3">2017-2018</span>
              <p className="text-gray-700">
                Taught English to kids as part of a community development
                program in Sumatra.
              </p>
            </div>

            {/* Experience Card 4 */}
            <div className="card p-6 text-center h-full">
              <h3 className="text-xl font-bold mb-3">English Online</h3>
              <span className="text-gray-500 block mb-3">2021-2026</span>
              <p className="text-gray-700">
                I am currently teaching English online to students from all over
                the world on the Cambly platform.
              </p>
            </div>
          </div>

          {/* LinkedIn Button */}
          <div className="text-center mt-8">
            <InfoButton
              href="https://www.linkedin.com/in/gavenhendricks/"
              text="View LinkedIn Profile"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </section>
      {/* Teaching Highlights Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-primary-dark mb-12">
            Teaching Highlights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Highlight 1 */}
            <div className="flex items-center gap-3">
              <Image
                src="/site-images/tick.png"
                alt="Tick Icon"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <p className="text-lg text-gray-700">TEFL Certified</p>
            </div>

            {/* Highlight 2 */}
            <div className="flex items-center gap-3">
              <Image
                src="/site-images/tick.png"
                alt="Tick Icon"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <p className="text-lg text-gray-700">Learning Specialist</p>
            </div>

            {/* Highlight 3 */}
            <div className="flex items-center gap-3">
              <Image
                src="/site-images/tick.png"
                alt="Tick Icon"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <p className="text-lg text-gray-700">
                Tutored over 2000 students
              </p>
            </div>

            {/* Highlight 4 */}
            <div className="flex items-center gap-3">
              <Image
                src="/site-images/tick.png"
                alt="Tick Icon"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <p className="text-lg text-gray-700">Friendly Tutor</p>
            </div>

            {/* Highlight 5 */}
            <div className="flex items-center gap-3">
              <Image
                src="/site-images/tick.png"
                alt="Tick Icon"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <p className="text-lg text-gray-700">
                Over 1500 hours tutoring online
              </p>
            </div>

            {/* Highlight 6 */}
            <div className="flex items-center gap-3">
              <Image
                src="/site-images/tick.png"
                alt="Tick Icon"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <p className="text-lg text-gray-700">Versatile Tutor</p>
            </div>

            {/* Highlight 7 */}
            <div className="flex items-center gap-3">
              <Image
                src="/site-images/tick.png"
                alt="Tick Icon"
                width={40}
                height={40}
                className="flex-shrink-0"
              />
              <p className="text-lg text-gray-700">Group lessons available</p>
            </div>
          </div>
        </div>
      </section>
      {/* Specialising In Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-primary-dark mb-12">
            Specialising In
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
            {/* Skill 1 */}
            <div className="flex flex-col items-center">
              <Image
                src="/site-images/speaking-english.png"
                alt="Speaking English"
                width={125}
                height={125}
                className="mb-3"
              />
              <p className="text-center text-gray-700">Spoken English</p>
            </div>

            {/* Skill 2 */}
            <div className="flex flex-col items-center">
              <Image
                src="/site-images/travel-english.png"
                alt="Travel English"
                width={125}
                height={125}
                className="mb-3"
              />
              <p className="text-center text-gray-700">English for Travel</p>
            </div>

            {/* Skill 3 */}
            <div className="flex flex-col items-center">
              <Image
                src="/site-images/study-english.png"
                alt="Study English"
                width={125}
                height={125}
                className="mb-3"
              />
              <p className="text-center text-gray-700">Academic English</p>
            </div>

            {/* Skill 4 */}
            <div className="flex flex-col items-center">
              <Image
                src="/site-images/work-english.png"
                alt="Work English"
                width={125}
                height={125}
                className="mb-3"
              />
              <p className="text-center text-gray-700">English for Work</p>
            </div>

            {/* Skill 5 */}
            <div className="flex flex-col items-center">
              <Image
                src="/site-images/grammar-english.png"
                alt="Grammar English"
                width={125}
                height={125}
                className="mb-3"
              />
              <p className="text-center text-gray-700">English Grammar</p>
            </div>

            {/* Skill 6 */}
            <div className="flex flex-col items-center">
              <Image
                src="/site-images/kids-english.png"
                alt="Kids English"
                width={125}
                height={125}
                className="mb-3"
              />
              <p className="text-center text-gray-700">English for Kids</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
