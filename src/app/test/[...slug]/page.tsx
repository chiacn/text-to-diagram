import path from "path";
import ArticlesList from "@/components/layout/articles/ArticlesList";
import ArticleLayout from "@/components/layout/articles/ArticleLayout";

/* Note: dynamicParams - 
    true : generateStaticParams에 없는 경로라도 필요에 따라 생성
    false : 포함 안 된 경로 404
 */
export const dynamicParams = true;
export async function generateStaticParams() {
  // return [{ slug: ["articles", "Argorithm", "Test"] }];
  return [];
}

interface PageProps {
  params: { slug: string[] };
}

export default function Page({ params }: PageProps) {
  const { slug } = params;

  const listPath = path.join(...slug);
  const menuTitle = slug[slug.length - 1];
  const isPost = menuTitle.includes(".mdx");

  return (
    <>
      {isPost ? (
        <ArticleLayout articlePath={listPath} />
      ) : (
        <ArticlesList menuTitle={menuTitle} listPath={listPath} />
      )}
    </>
  );
}
