
export default function WarningOverlay({
  confirmMatrix,
  cancelMatrix,
}: {
  confirmMatrix: () => void;
  cancelMatrix: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(8,6,18,0.96)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(0.5rem,2vw,0.9rem)",
        padding: "clamp(0.9rem,3vw,1.5rem)",
        textAlign: "center",
        borderRadius: "0 0 12px 12px",
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: "clamp(1.1rem,4vw,1.5rem)" }}>⚠️</div>
      <p
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "clamp(0.58rem,2vw,0.72rem)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#ffbd2e",
          fontWeight: 700,
        }}
      >
        aviso de fotossensibilidade
      </p>
      <p
        style={{
          fontSize: "clamp(0.66rem,2.2vw,0.8rem)",
          color: "rgba(237,232,220,0.55)",
          lineHeight: 1.65,
          maxWidth: "min(340px,100%)",
        }}
      >
        este efeito contém{" "}
        <strong style={{ color: "#ede8dc" }}>
          luzes piscantes, flashes e movimentos bruscos
        </strong>
        . Pode causar desconforto em pessoas com epilepsia fotossensitiva.
      </p>
      <div
        className="terminal-warning-actions"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.6rem",
          marginTop: "0.3rem",
          width: "100%",
        }}
      >
        <button
          onClick={confirmMatrix}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(0.65rem,2vw,0.75rem)",
            letterSpacing: "0.1em",
            background: "#ff5f56",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            cursor: "pointer",
            fontWeight: 700,
            flex: "1 1 auto",
            minWidth: "7rem",
          }}
        >
          [Y] confirmar
        </button>
        <button
          onClick={cancelMatrix}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(0.65rem,2vw,0.75rem)",
            letterSpacing: "0.1em",
            background: "transparent",
            color: "rgba(237,232,220,0.45)",
            border: "1px solid rgba(237,232,220,0.15)",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            cursor: "pointer",
            flex: "1 1 auto",
            minWidth: "7rem",
          }}
        >
          [N] cancelar
        </button>
      </div>
    </div>
  );
}
