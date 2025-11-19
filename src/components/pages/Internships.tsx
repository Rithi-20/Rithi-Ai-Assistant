export default function Internships() {
  return (
    <div className="rounded-2xl bg-white/90 p-8 shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-cyan-600 mb-6">Internships</h2>

      <div className="bg-white shadow p-6 rounded-xl">
        <h3 className="text-xl font-bold">Artificial Intelligence | 62 days | 2025</h3>
        {/* <p className="text-gray-600">Learned key AI concepts and built a real-time anomaly detection model that identifies unusual patterns in data for fraud detection and system error prevention.</p> */}

        <p className="mt-3 text-gray-700">
          Worked on ML models and built a real-time anomaly detection system that identifies unusual patterns for fraud detection and system error prevention.
        </p>
      </div>

      <div className="bg-white shadow p-6 rounded-xl">
        <h3 className="text-xl font-bold">Web Development | 15 days | 2024</h3>
        {/* <p className="text-gray-600">Learned key AI concepts and built a real-time anomaly detection model that identifies unusual patterns in data for fraud detection and system error prevention.</p> */}

        <p className="mt-3 text-gray-700">
          Completed a web development internship by building the Nexus platform, developing the frontend (HTML, CSS, JavaScript) and backend (Python) to connect workers with job opportunities.
        </p>
      </div>
    </div>
  );
}
