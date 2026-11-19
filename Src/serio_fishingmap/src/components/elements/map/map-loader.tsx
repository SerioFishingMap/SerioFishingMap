"use client";

import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/elements/map/map").then((mod) => mod.Map),
  { ssr: false }
);

export default function MapLoader() {
  return <Map />;
}
