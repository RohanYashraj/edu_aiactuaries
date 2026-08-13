import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  href: string;
  cover?: string; // URL for actual image when available
  rotation: string; // Tailwind transform class or inline style
  zIndex: number;
  offset: string;
  label?: string;
}

const defaultBooks: Book[] = [
  {
    id: "book-1",
    title: "The Full Stack Actuary",
    href: "https://fullstackactuary.com/",
    rotation: "-rotate-3",
    zIndex: 10,
    offset: "translate-x-20 -translate-y-24 md:translate-x-24 md:-translate-y-40 scale-95",
  },
  {
    id: "book-2",
    title: "Agentic AI for Actuaries",
    href: "https://aiforactuaries.sssia.org",
    rotation: "rotate-0",
    zIndex: 30,
    offset: "-translate-x-24 -translate-y-16 md:-translate-x-32 md:-translate-y-24 scale-100",
  },
  {
    id: "book-3",
    title: "Indian Actuaries Climate Index",
    href: "https://climateindex.sssia.org", // Fallback until official URL is provided
    rotation: "rotate-3",
    zIndex: 20,
    offset: "translate-x-56 -translate-y-12 md:translate-x-44 md:translate-y-32 scale-90",
    label: "Index",
  },
  {
    id: "book-4",
    title: "SUTRA",
    href: "https://sutra.sssia.org/",
    rotation: "-rotate-6",
    zIndex: 40,
    offset: "-translate-x-12 translate-y-32 md:-translate-x-16 md:translate-y-44 scale-95",
    label: "Platform",
  },
];

export function PublicationStack({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center lg:items-end w-full", className)}>
      <div className="text-right mb-8 lg:mb-12 hero-books-label">
        <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase block">
          Platforms & Publications / 04
        </span>
      </div>

      {/* 
        Container for the overlapping books. 
        Uses absolute positioning internally for desktop, and a flex fallback for mobile if needed.
      */}
      <div className="relative w-full max-w-[450px] md:max-w-[600px] h-[400px] md:h-[500px] flex justify-center items-center mt-8">
        {defaultBooks.map((book, index) => (
          <div
            key={book.id}
            className={cn(
              "hero-book absolute",
              book.rotation,
              book.offset
            )}
            style={{ zIndex: book.zIndex }}
          >
            <Link
              href={book.href}
              target={book.href.startsWith("http") ? "_blank" : undefined}
              rel={book.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="block transition-transform duration-500 ease-out group hover:-translate-y-4 hover:scale-[1.03] hover:z-50"
              aria-label={`${book.title} — publication`}
            >
              <div className="relative aspect-[4/5] w-36 md:w-40 lg:w-48 p-6 bg-white border border-[#0A192F]/10 shadow-sm group-hover:shadow-md transition-shadow duration-500 overflow-hidden flex flex-col justify-center items-center text-center">
                <div className="absolute left-0 bottom-0 h-[2px] w-full bg-[#F26A21] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 h-full">
                    <div className="text-[10px] font-bold tracking-widest text-[#0A192F]/40 uppercase">
                      {book.label || "Publication"}
                    </div>
                    <div className="w-8 h-[2px] bg-[#F26A21]" />
                    <h3 className="font-display text-lg lg:text-xl text-[#0A192F] group-hover:text-[#F26A21] transition-colors leading-tight">
                      {book.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Hover Tooltip (Desktop only) */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none hidden md:flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[#F26A21]">
                Read More <ArrowRight className="size-3" />
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Mobile-only visible titles fallback */}
      <div className="mt-8 flex flex-col gap-3 items-center md:hidden w-full hero-book-mobile-titles">
        {defaultBooks.map((book) => (
          <Link 
            key={book.id} 
            href={book.href} 
            className="text-xs font-bold tracking-widest text-[#0A192F]/60 uppercase flex items-center gap-2 hover:text-[#F26A21]"
          >
            {book.title} <ArrowRight className="size-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
