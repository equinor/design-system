import "@equinor/eds-tokens/css/variables-dynamic.css";
import styles from "./styles.module.css";
import { Chip } from "@/app/_components/Chip";
import { Dashboard } from "@/app/_components/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Final - Equinor Design System Tokens",
  description:
    "Exercise where we replace colors with tokens from Equinor Design System",
};

function Page() {
  return <Dashboard styles={styles} Chip={Chip} />;
}

export default Page;
