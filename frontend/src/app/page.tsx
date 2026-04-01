export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-primary-dark">
          English with Gaven
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          We are currently performing scheduled maintenance to improve your
          experience.
        </p>
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-primary-dark">
            Under Maintenance
          </h2>
          <p className="mt-3 text-gray-700">
            The website is online, and we are now connecting backend services
            and database features.
          </p>
          <p className="mt-2 text-gray-700">
            Please check back shortly. Thank you for your patience.
          </p>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          Status: maintenance in progress.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Deployment checkpoint: DB reintroduction phase 1.
        </p>
      </section>
    </main>
  );
}
