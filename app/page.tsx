import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.png"
          alt="Serene green landscape with mountains and pagodas"
          fill
          priority
          className="object-cover object-center sm:object-center md:object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e9dfc1] via-[#e9dfc1]/80 to-transparent h-[70vh] md:h-[60vh]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-[#1a3329] font-serif italic text-2xl md:text-3xl tracking-tight">
                sub<span className="text-[#264135]">*</span>
              </span>
            </div>
            <nav className="hidden md:flex space-x-12">
              <Link href="#" className="text-[#1a3329] hover:text-[#0e1c15] transition-colors font-medium text-lg">
                home
              </Link>
              <Link href="#features" className="text-[#1a3329] hover:text-[#0e1c15] transition-colors font-medium text-lg">
                features
              </Link>
              <Link href="#pricing" className="text-[#1a3329] hover:text-[#0e1c15] transition-colors font-medium text-lg">
                pricing
              </Link>
            </nav>
            <div className="block md:hidden">
              <button className="text-[#1a3329] p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
            <Button className="hidden md:block bg-[#1a3329] hover:bg-[#0e1c15] text-[#f0e9d8] rounded-full px-7 py-2 h-auto text-base shadow-md">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col">
        <section className="flex-grow flex items-start md:items-center pt-20 md:pt-0">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-5xl mx-auto text-center mt-4 sm:mt-0 md:-mt-60">
              <h1 className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-baseline justify-center md:gap-x-4 px-1">
                  <span className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-[#0b251a] drop-shadow-sm leading-tight">
                    Track Subscriptions
                  </span>
                  <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-[#183c28] drop-shadow-md mt-1 md:mt-0">
                    Save Money
                  </span>
                </div>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#1c3226] font-light mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
                Automatically detect subscriptions from your Gmail inbox, organize spending‎ ‎ ‎ ‎ ‎ ‎ ‎  ‎ ‎data, and receive monthly
                summaries to control your recurring expenses.
              </p>
              <div className="flex justify-center">
                <Button className="bg-[#345542] hover:bg-[#1a3329] text-[#f5f1e6] rounded-full px-4 py-2 sm:px-8 sm:py-2.5 md:px-10 md:py-3 h-auto text-sm sm:text-base md:text-lg shadow-md">
                  Start Saving Today
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
