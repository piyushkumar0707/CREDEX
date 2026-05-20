import { ImageResponse } from "next/og";

export const alt = "SpendScope by Credex AI spend audit";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#d8f2de",
          color: "#13201a",
          padding: "64px",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 34, fontWeight: 800 }}>SpendScope by Credex</div>
          <div
            style={{
              border: "2px solid #13201a",
              borderRadius: "999px",
              padding: "14px 24px",
              fontSize: 24,
              fontWeight: 700
            }}
          >
            Free AI Spend Audit
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ maxWidth: "920px", fontSize: 86, lineHeight: 0.98, fontWeight: 900 }}>
            Find wasted AI spend before the next invoice lands.
          </div>
          <div style={{ marginTop: 34, fontSize: 32, color: "#345b45" }}>
            Plan-fit recommendations, annualized savings, and a shareable report.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 24, fontWeight: 700 }}>
          <span>Cursor</span>
          <span>Copilot</span>
          <span>Claude</span>
          <span>ChatGPT</span>
          <span>Gemini</span>
          <span>APIs</span>
        </div>
      </div>
    ),
    size
  );
}
