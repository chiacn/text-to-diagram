import { getArticle } from "@/utils/postUtils";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

interface ArticleLayoutProps {
  articlePath: string;
}
export default async function ArticleLayout({
  articlePath,
}: ArticleLayoutProps) {
  const { markdownSource } = await getArticle(articlePath);

  // const title = articlePath.split(path.sep).pop();
  // const decodedTitle = decodeURIComponent(title as string).replace(".mdx", "");

  return (
    <div className="prose">
      {/* <h1>{decodedTitle}</h1> */}
      <MDXRemote
        source={markdownSource}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        }}
      />
    </div>
  );
}
