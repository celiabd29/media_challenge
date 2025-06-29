"use client";
import { use } from "react";
import Video from "@/components/Video";
import BottomNavbar from "@/components/BottomNavbar";

export default function VideoPage({ params }) {
  const { id } = use(params);

  return (
    <>
      <Video videoId={id} />
      <BottomNavbar />
    </>
  );
}
