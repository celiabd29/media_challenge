"use client";

export const dynamic = "force-dynamic";

import Login from "../../components/Login";
import BottomNavbar from "../../components/BottomNavbar";

export default function LoginPage() {
  return (
    <>
      <Login />
      <BottomNavbar />
    </>
  );
}

