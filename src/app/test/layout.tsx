import ArticleContainer from "@/components/layout/ArticleContainer";

export default function BlogLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <ArticleContainer>{children}</ArticleContainer>;
}
