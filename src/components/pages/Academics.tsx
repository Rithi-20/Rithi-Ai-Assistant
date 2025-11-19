export default function Academics() {
  return (
    <div className="rounded-2xl bg-white/90 p-8 shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-cyan-600 mb-6">Academic Qualifications</h2>

      <div className="space-y-6 text-gray-800">
        
        <div>
          <h3 className="text-xl font-bold">B.E. Computer Science and Engineering</h3>
          <p>Dr.N.G.P Institute of Technology, Coimbatore</p>
          <p>2022 – 2026 &nbsp; <span className="text-cyan-600 font-semibold">8.31 CGPA</span></p>
        </div>

        <div>
          <h3 className="text-xl font-bold">HSC</h3>
          <p>Venkatalakshmi Matriculation Higher Secondary School, Coimbatore</p>
          <p>2021 – 2022 &nbsp; <span className="text-cyan-600 font-semibold">90.5%</span></p>
        </div>
        <div>
          <h3 className="text-xl font-bold">SSLC</h3>
          <p>Venkatalakshmi Matriculation Higher Secondary School, Coimbatore</p>
          <p>2020 – 2021 &nbsp; <span className="text-cyan-600 font-semibold">79.6%</span></p>
        </div>

      </div>
    </div>
  );
}
