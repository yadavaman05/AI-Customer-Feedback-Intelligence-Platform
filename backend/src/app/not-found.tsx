export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>404 - Endpoint Not Found</h1>
      <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}>The requested backend route does not exist.</p>
    </main>
  );
}
