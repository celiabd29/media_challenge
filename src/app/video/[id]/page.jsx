"use client";
import { use } from "react";
import Video from "@/components/Video";

export default function VideoPage({ params }) {
  const { id } = use(params);

  return (
    <>
      <Video videoId={id} />
    </>
  );
}
