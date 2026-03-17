import { BackendStatus } from "../BackendStatus";

export function Footer() {
  return (
    <footer className="border-t border-purple-900 py-8 px-4 mt-auto bg-zinc-950 backdrop-blur-lg shadow-lg shadow-purple-900/20">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-purple-200">
        <div className="font-semibold text-purple-300 drop-shadow-lg">
          © {new Date().getFullYear()} Maneshwar Holla. All rights reserved.
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-700 shadow-md shadow-purple-900/10 animate-pulse"
          title="System Status"
        >
          <span className="text-xs uppercase tracking-wider text-purple-400">
            Backend
          </span>
          <BackendStatus />
        </div>
      </div>
    </footer>
  );
}
