export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-primary-dark">
          English with Gaven
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Lean Hostinger smoke build: Next.js homepage + Express API without a
          required database connection.
        </p>
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
          <h2 className="text-xl font-semibold text-primary-dark">
            Smoke test checklist
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
            <li>This homepage returns HTTP 200.</li>
            <li>
              <a className="underline" href="/api/health">
                /api/health
              </a>{" "}
              returns JSON with status OK.
            </li>
            <li>
              <a className="underline" href="/api/smoke">
                /api/smoke
              </a>{" "}
              returns lean-mode response when enabled.
            </li>
          </ul>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          If this deploy passes, reintroduce DATABASE_URL and DB-backed routes
          in phase two.
        </p>
      </section>
    </main>
  );
}
