export default function Page() {
  // Update these details as needed
  const coupleNames = "Riley & Christine";
  const date = "September 26, 2026";
  const location = "Durango, Colorado";

  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-[var(--page-padding)]">
        <div className="max-w-5xl w-full text-center">
          <h1 className="animate-fadeUp fade-delay-1 text-5xl md:text-7xl tracking-tight leading-tight drop-shadow-2xl">
            {coupleNames}
          </h1>
          <p className="animate-fadeUp fade-delay-2 mt-6 text-xl md:text-2xl/relaxed opacity-95">
            {date} • {location}
          </p>
        </div>
      </section>

      <footer className="px-[var(--page-padding)] pb-10">
        <p className="animate-fadeUp fade-delay-3 text-center text-sm md:text-base opacity-90">
          Please save the date. We're working on more details around travel, accommodations, and fun. We can't wait to celebrate with you in Durango.
        </p>
      </footer>
    </main>
  );
}
