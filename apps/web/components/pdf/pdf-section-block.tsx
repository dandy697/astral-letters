export function PdfSectionBlock({
  title,
  body,
  aside
}: {
  title: string;
  body: string;
  aside?: string;
}) {
  return (
    <section
      style={{
        border: "1px solid #EAE3DC",
        borderRadius: "24px",
        padding: "24px",
        background: "#FFFFFF",
        boxShadow: "0 2px 4px rgba(58, 31, 61, 0.04)"
      }}
    >
      <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#C8A96A", marginBottom: "12px" }}>
        {title}
      </div>
      <div style={{ fontSize: "15px", lineHeight: "1.7", color: "#1A1A1A", fontWeight: "400" }}>
        {body}
      </div>
      {aside ? (
        <div style={{ 
          marginTop: "16px", 
          fontSize: "13px", 
          lineHeight: "1.6", 
          color: "#6B5A6B", 
          borderTop: "1px solid #F3EFED", 
          paddingTop: "14px",
          fontStyle: "italic"
        }}>
          {aside}
        </div>
      ) : null}
    </section>
  );
}

