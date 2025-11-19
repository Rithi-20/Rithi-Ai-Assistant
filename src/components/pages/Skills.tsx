export default function Skills() {
  return (
    <div className="rounded-2xl bg-white/90 p-8 shadow-md max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-cyan-600 mb-8">Technical Skills</h2>

      <div className="space-y-6">

        <div>
          <h3 className="text-xl font-bold mb-2">Programming Languages</h3>
          <div className="flex flex-wrap gap-3">
            <span className="tag">Python</span>
            <span className="tag">Java</span>
            <span className="tag">JavaScript</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Web Technologies</h3>
          <div className="flex flex-wrap gap-3">
            <span className="tag">HTML</span>
            <span className="tag">CSS</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Data Science & AI</h3>
          <div className="flex flex-wrap gap-3">
            <span className="tag">Machine Learning</span>
            <span className="tag">Deep Learning</span>
            <span className="tag">Neural Network</span>
            <span className="tag">TensorFlow</span>
            <span className="tag">Pandas</span>
            <span className="tag">NumPy</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Database</h3>
          <div className="flex flex-wrap gap-3">
            <span className="tag">Sql</span>
            <span className="tag">Mongodb</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Tools & Platforms</h3>
          <div className="flex flex-wrap gap-3">
            <span className="tag">Git</span>
            <span className="tag">GitHub</span>
            <span className="tag">VS Code</span>
            <span className="tag">Jupyter</span>
            <span className="tag">Docker</span>
          </div>
        </div>

      </div>
    </div>
  );
}
