import { ThemeButton } from "../_components/ThemeButton";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ThemeButton />
    </>
  );
}

export default Layout;
