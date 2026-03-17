import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="py-24 px-4 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "anticipate" }}
        className="max-w-4xl mx-auto text-center rounded-2xl shadow-xl shadow-purple-900/30 backdrop-blur-lg p-10"
      >
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
          Hi, I'm <span className="text-purple-400 drop-shadow-lg">Maneshwar Holla</span>
        </h1>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Product-oriented engineer with hands-on experience in backend,
          frontend, and DevOps. I build scalable developer tools, optimize AI
          workflows, and deliver high-impact systems for real-world usage.
        </p>
      </motion.div>
    </section>
  );
}
