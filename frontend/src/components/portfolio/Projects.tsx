import { motion } from "framer-motion";

export function Projects() {
  return (
    <section
      id="projects"
      className="py-12 px-4 border-t border-zinc-800/50 bg-zinc-950"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-300 mb-6">
          Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px #6c3fcf55" }}
            className="p-8 rounded-2xl bg-purple-900/30 border border-purple-700 hover:border-purple-400 transition-colors cursor-pointer shadow-lg shadow-purple-900/20 backdrop-blur-lg"
          >
            <h3 className="font-medium text-purple-200 text-lg">LiveAPI</h3>
            <p className="text-sm text-zinc-200 mt-2 leading-relaxed">
              Automated API documentation platform. Ingests code repositories,
              parses code, and generates user-friendly docs. Tech: Python
              (Django), Node.js, Go, React, PostgreSQL, Regex prompt
              engineering.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px #6c3fcf55" }}
            className="p-8 rounded-2xl bg-purple-900/30 border border-purple-700 hover:border-purple-400 transition-colors cursor-pointer shadow-lg shadow-purple-900/20 backdrop-blur-lg"
          >
            <h3 className="font-medium text-purple-200 text-lg">
              FreeDevTools
            </h3>
            <p className="text-sm text-zinc-200 mt-2 leading-relaxed">
              Large-scale static platform serving 125,000+ pages. SEO-optimized,
              integrates Meilisearch for fast search. Tech: Astro, Meilisearch,
              Static Site Generation, SEO, Google Search Console (8M+
              impressions).
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
