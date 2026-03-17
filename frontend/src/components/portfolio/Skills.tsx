import { motion } from "framer-motion";

export function Skills() {
  const categories = [
    {
      name: "Languages",
      skills: ["Python", "Go", "JavaScript", "Java", "SQL"],
    },
    { name: "Frontend", skills: ["React", "React Native", "Figma", "Astro"] },
    { name: "Backend", skills: ["Django", "Node.js", "PostgreSQL", "Parse"] },
    {
      name: "Cloud/Tools",
      skills: [
        "Meilisearch",
        "Static Site Generation",
        "Prompt Engineering",
        "DevOps",
        "Git",
      ],
    },
  ];

  return (
    <section className="py-12 px-4 border-t border-zinc-800/50 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-300 mb-6">
          Skills & Languages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-zinc-900/60 rounded-xl shadow-md shadow-purple-900/10 p-6"
            >
              <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4 border-b border-purple-900 pb-2">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.08, backgroundColor: "#6c3fcf" }}
                    className="px-3 py-1.5 rounded-lg bg-purple-900/30 border border-purple-700 text-purple-200 text-xs hover:border-purple-400 transition-colors shadow-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
