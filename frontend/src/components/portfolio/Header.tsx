export function Header() {
  return (
    <header className="border-b border-purple-900 sticky top-0 z-10 bg-zinc-950 backdrop-blur-lg shadow-lg shadow-purple-900/20">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#"
          className="font-semibold text-purple-300 hover:text-purple-400 transition-colors text-xl tracking-tight drop-shadow-lg"
        >
          Maneshwar Holla
        </a>
        <nav className="flex items-center gap-6">
          <a
            href="#experience"
            className="text-sm text-purple-200 hover:text-purple-400 transition-colors font-medium px-3 py-1 rounded-lg bg-purple-900/20 border border-purple-700 hover:border-purple-400 shadow-sm"
          >
            Experience
          </a>
          <a
            href="#projects"
            className="text-sm text-purple-200 hover:text-purple-400 transition-colors font-medium px-3 py-1 rounded-lg bg-purple-900/20 border border-purple-700 hover:border-purple-400 shadow-sm"
          >
            Projects
          </a>
        </nav>
      </div>
    </header>
  );
}
