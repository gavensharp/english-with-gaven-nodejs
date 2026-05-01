import Image from "next/image";
import CTAButton from "@/components/CTAButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Hero Content */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-center text-primary-dark pb-3">
                Welcome to English with Gaven!
              </h1>
              <p className="text-lg mb-4 text-center text-gray-700">
                I offer premium online English tutoring, customized for your
                success.
              </p>

              {/* CTA Button */}
              <div className="text-center mt-12">
                <CTAButton />
              </div>
            </div>

            {/* Hero Video */}
            <div className="text-center mt-4">
              <div className="relative pb-[56.25%] rounded-[20px] overflow-hidden shadow-lg border-2 border-neutral ">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/sJ7a7FAJirQ?si=_MJeiW5kYgH2Yfbc"
                  title="YouTube video player"
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

      {/* Services Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-primary-dark mb-12">
            My Services
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Speaking English */}
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/site-images/speaking-english.png"
                  alt="Speaking English"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">Spoken English</h3>
              <p className="text-gray-700">
                Improve your conversational skills with personalized lessons
                focused on pronunciation, fluency, and confidence.
              </p>
            </div>

            {/* Travel English */}
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/site-images/travel-english.png"
                  alt="Travel English"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">English for Travel</h3>
              <p className="text-gray-700">
                Learn essential phrases and vocabulary for traveling confidently
                around the world.
              </p>
            </div>

            {/* Work English */}
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/site-images/work-english.png"
                  alt="Work English"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">English for Work</h3>
              <p className="text-gray-700">
                Master professional English for emails, presentations, and
                business communication.
              </p>
            </div>

            {/* Study English */}
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/site-images/study-english.png"
                  alt="Study English"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">Academic English</h3>
              <p className="text-gray-700">
                Prepare for exams like IELTS, TOEFL, or academic English
                requirements.
              </p>
            </div>

            {/* Grammar */}
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/site-images/grammar-english.png"
                  alt="Grammar"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">English Grammar</h3>
              <p className="text-gray-700">
                Build a strong foundation with clear explanations and practical
                exercises.
              </p>
            </div>

            {/* Kids English */}
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/site-images/kids-english.png"
                  alt="Kids English"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-xl font-bold mb-3">English for Kids</h3>
              <p className="text-gray-700">
                Fun and engaging lessons designed specifically for young
                learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-primary-dark mb-12">
            How to Get Started
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent-orange flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-3">Sign Up</h3>
                <p className="text-gray-700 text-lg">
                  Sign Up/Register your name and email. Upload your profile
                  picture.
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="ml-8 h-12 w-0.5 bg-neutral "></div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent-orange flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-3">Choose Your Plan</h3>
                <p className="text-gray-700 text-lg">
                  Select your plan to get started.{" "}
                  {/*
                  <a
                    href="/calendar"
                    className="text-primary  underline hover:text-accent-orange">
                    View
                  </a>{" "}
                  Gaven's availability schedule.{" "}
                  */}
                  <a
                    href="/contact"
                    className="text-primary  underline hover:text-accent-orange">
                    Contact
                  </a>{" "}
                  Gaven to confirm Gaven's availability and your lesson
                  times. Starting with a free 10-minute video call for an
                  introduction.
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="ml-8 h-12 w-0.5 bg-neutral "></div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent-orange flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-3">
                  Select Video Call App
                </h3>
                <p className="text-gray-700 text-lg">
                  Select video call application. Popular choices include Zoom,
                  Google Meet, and Microsoft Teams. Or use the default video
                  call application.
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="ml-8 h-12 w-0.5 bg-neutral "></div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent-orange flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  4
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-3">Start Learning</h3>
                <p className="text-gray-700 text-lg">
                  Make sure you have confirmed your lesson times with Gaven.
                  Complete monthly payment via PayPal. And we are ready!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Pricing Plans
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            Tailored for students, professionals and families. Schedule
            60-minute sessions or 30-minute sessions. All plans include
            personalized lesson plans and progress tracking.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Starter Plan */}
            <div className="card p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Starter Plan</h3>
              <p className="text-gray-600 mb-4">One hour per week</p>
              <p className="text-4xl font-bold text-primary-dark mb-6">
                $119
                <span className="text-lg text-gray-600">/month</span>
              </p>
              <a href="/signup" className="btn btn-outline-primary w-full">
                Get Started
              </a>
            </div>

            {/* Immersion Plan (Most Popular) */}
            <div className="card p-6 text-center border-primary shadow-lg transform md:scale-105 bg-white relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3/4 text-primary-dark bg-primary/20 px-4 py-5 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4">Immersion Plan</h3>
              <p className="text-gray-600 mb-4">Two hours per week</p>
              <p className="text-5xl font-bold text-primary-dark mb-6">
                $199
                <span className="text-lg text-gray-600">/month</span>
              </p>
              <a href="/signup" className="btn btn-primary w-full">
                Get Started
              </a>
            </div>

            {/* Deep Learning Plan */}
            <div className="card p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Deep Learning Plan</h3>
              <p className="text-gray-600 mb-4">Three hours per week</p>
              <p className="text-4xl font-bold text-primary-dark mb-6">
                $239
                <span className="text-lg text-gray-600">/month</span>
              </p>
              <a href="/signup" className="btn btn-outline-primary w-full">
                Get Started
              </a>
            </div>
          </div>

          {/* Free Trial Note */}
          <div className="text-center mt-8">
            <p className="text-gray-700">
              Free 10 minute trial lesson included. Get started today!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
