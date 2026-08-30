"use client";

export default function Error({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>500 - Server Error</h1>
      <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}>An internal server error occurred.</p>
      <button
        type="button"
        onClick={() => reset()}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer", borderRadius: "0.25rem", border: "1px solid #ccc" }}
      >
        Retry
      </button>
    </main>
  );
}
