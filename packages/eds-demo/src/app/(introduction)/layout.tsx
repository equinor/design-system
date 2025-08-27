import "github-markdown-css/github-markdown.css";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="markdown-body min-h-dvh">
      <div className="container mx-auto py-16 px-16">{children}</div>
    </div>
  );
}

export default Layout;
