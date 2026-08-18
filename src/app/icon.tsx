import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#282c34",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 13,
          fontWeight: 700,
          color: "#abb2bf",
        }}
      >
        <span style={{ color: "#d19a66" }}>{"<"}</span>
        LM
        <span style={{ color: "#d19a66" }}>{"/>"}</span>
      </div>
    ),
    { ...size },
  );
}
