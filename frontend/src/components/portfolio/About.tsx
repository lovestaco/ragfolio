import { motion } from "framer-motion";

export function About() {
  return (
    <section className="py-12 px-4 border-t border-zinc-800/50 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-zinc-900/60 rounded-2xl shadow-lg shadow-purple-900/20 p-8"
      >
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">About</h2>
        <p className="text-zinc-200 leading-relaxed">
          I'm Maneshwar Holla, a full-stack engineer with over a year of production experience at Hexmos, specializing in backend, frontend, and DevOps. I thrive on building scalable systems, optimizing AI workflows, and mentoring developers. My expertise spans developer tooling, API documentation automation, and search-driven content platforms.
        </p>
      </motion.div>
    </section>
  );
}
