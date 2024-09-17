import Aside from "./aside/Aside";
import { getDirectoryStructure } from "@/utils/postUtils";

interface ArticleContainerProps {
  children: React.ReactNode;
}

export default async function CommonContainer({
  children,
}: ArticleContainerProps) {
  const menuTree = getDirectoryStructure("./src/posts/articles");
  // console.log("mdxList --- ", JSON.stringify(menuTree, null, 2));

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row">
        {/* <Aside menuTree={menuTree} /> */}
        <div className="w-full sm:px-8">{children}</div>
      </div>
    </>
  );
}
