import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        fontSize: 64,
        background: "#0d1117",
        color: "#14b8a6",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        Mening Saytim
      </div>
    ),
    { ...size }
  );
}