"use client";
export default function Stats() {
  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "10M+", label: "Keywords Tracked" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
  ];

  return (
    <section className="py-20 px-6 bg-[#736bff] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="text-5xl font-bold mb-2">{s.value}</div>
            <div className="text-white/80 text-lg">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
