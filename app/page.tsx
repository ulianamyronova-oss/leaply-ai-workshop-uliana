import { HomeContent } from "@/components/home/home-content"

export default function Page() {
  return (
    <main className="relative min-h-svh overflow-x-hidden bg-background text-foreground">
      <div className="relative mx-auto flex max-w-3xl flex-col gap-10 px-6 py-10 sm:gap-12 sm:py-14">
        <header className="flex flex-col items-center text-center">
          <h1 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
            Wizard&apos;s Library
          </h1>
        </header>

        <HomeContent />

        <footer className="text-center font-mono text-xs tracking-[0.08em] text-muted-foreground/60 uppercase">
          press d to switch to night
        </footer>
      </div>
    </main>
  )
}
