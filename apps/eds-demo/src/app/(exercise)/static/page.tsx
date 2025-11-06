import "@equinor/eds-tokens/css/variables";
import styles from "./styles.module.css";
import { Dashboard } from "@/app/_components/Dashboard";
import { Metadata } from "next";
import { Chip } from "@/app/_components/Chip";

export const metadata: Metadata = {
  title: "Exercise - Equinor Design System Tokens",
  description:
    "Exercise where we replace colors with tokens from Equinor Design System",
};

function Page() {
  return <Dashboard styles={styles} Chip={Chip} />;
}

export default Page;
