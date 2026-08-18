import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 19,
          fontWeight: 700,
          color: "#abb2bf",
        }}
      >
        L<span style={{ color: "#d19a66" }}>M</span>
      </div>
    ),
    { ...size },
  );
}
