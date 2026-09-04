"use client";

// Last-resort boundary for a failure in the root layout itself. It replaces
// the whole document, so it must render its own <html> and <body> and cannot
// rely on any app styling having loaded.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f8faf9",
          color: "#14231d",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#5b6b63", marginTop: "0.75rem" }}>
            The site failed to load. Please try again in a moment.
          </p>
          {error.digest && (
            <p style={{ color: "#5b6b63", fontSize: "0.75rem", fontFamily: "monospace" }}>Reference: {error.digest}</p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#0f6b4c",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
