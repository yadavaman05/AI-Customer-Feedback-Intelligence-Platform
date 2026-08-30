export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Loop Intelligence Backend API</h1>
      <p style={{ fontSize: "0.875rem", color: "#666" }}>API server is operational. Endpoints available under <code>/api/*</code>.</p>
    </main>
  );
}
