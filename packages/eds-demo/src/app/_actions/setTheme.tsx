"use server";

import { cookies } from "next/headers";

export async function setTheme(theme: "light" | "dark") {
  (await cookies()).set("theme", theme);
}
