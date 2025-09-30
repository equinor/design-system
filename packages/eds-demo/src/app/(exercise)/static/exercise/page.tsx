import "@equinor/eds-tokens/css/variables-static.css";
import { Chip } from "./Chip";

import styles from "./styles.module.css";
import { Dashboard } from "@/app/_components/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercise - Equinor Design System Tokens",
  description:
    "Exercise where we replace colors with tokens from Equinor Design System",
};

function Page() {
  return <Dashboard styles={styles} Chip={Chip} />;
}

export default Page;
