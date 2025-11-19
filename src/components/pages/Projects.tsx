export default function Projects() {
  return (
    <div className="rounded-2xl bg-white/90 p-8 shadow-md max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-cyan-600 mb-8">Projects</h2>

      <div className="grid grid-cols-2 gap-8">

        
        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-1">Her Health - 2024</h3>
          <p className="text-gray-700 mb-3">Developed an AI-powered chatbot that analyzes user symptoms and provides personalized health suggestions for breast cancer, PCOD, and stress.</p>
          <div className="flex flex-wrap gap-3">
            <span className="tag">AI/ML</span>
            <span className="tag">Healthcare</span>
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-1">Anomaly Detection - 2025</h3>
          <p className="text-gray-700 mb-3">Built an ML-based anomaly detection system to identify unusual patterns and improve system security.</p>
          <div className="flex flex-wrap gap-3">
            <span className="tag">Python</span>
            <span className="tag">Artificial Intelligence</span>
            <span className="tag">Machine Learning</span>
          </div>
        </div>

        {/* Eco Sync */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-1">Eco Sync - 2024</h3>
          <p className="text-gray-700 mb-3">Built a blockchain system that rewards users for conservation photos, promoting environmental awareness.</p>
          <div className="flex flex-wrap gap-3">
            <span className="tag">Blockchain</span>
            <span className="tag">Solodity</span>
          </div>
        </div>

        {/* QR Auth */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-1">Future of Authentication using Encrypted QR code - 2024</h3>
          <p className="text-gray-700 mb-3">Developed a one-time encrypted QR-based mobile number verification system that works securely without OTPs or active recharge.</p>
          <div className="flex flex-wrap gap-3">
            <span className="tag">Cryptography</span>
            <span className="tag">Authentication</span>
          </div>
        </div>

      </div>
    </div>
  );
}
