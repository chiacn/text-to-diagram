import { ArticlesList, MenuTreeNode } from "@/lib/types";
import { compileMDX } from "next-mdx-remote/rsc";

const fs = require('fs');
const path = require('path');

export const getArticlesList = async (listPath: string): Promise<ArticlesList[]> => {
  try {
    console.log('getArticlesList --- listPath --- ', listPath);
    const directoryPath = path.join(
      process.cwd(),
      "src",
      "posts",
      listPath,
    );

    const fileList = fs.readdirSync(directoryPath); // 해당 경로의 하위 파일 배열로 반환

    const mdxList = await Promise.all(fileList.map(async (fileName: string) => {
      const mdxPath = path.join(directoryPath, fileName);
      const markdownSource = fs.readFileSync(mdxPath, "utf-8");


      const { frontmatter } = await compileMDX({
        source: markdownSource,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: []
          }
        }
      });
      return {
        title: fileName.replace('.mdx', ''),
        urlPath: '/blog/' + listPath + '/' + fileName,
        frontmatter: frontmatter,
      };
    }));
    return mdxList
      .sort((a: any, b: any) =>  Number(new Date(b.frontmatter.date)) - Number(new Date(a.frontmatter.date)));
  } catch (error) {
    console.error('getArticlesList error --- ', error);
    return [];
  }
}

export const getArticle = async (articlePath: string) => {
  try {
    console.log('articlePath --- ', articlePath);
    const targetPath = path.join(
      process.cwd(),
      "src",
      "posts",
      articlePath,
    );

    const decodedPath = decodeURIComponent(targetPath);
    const markdownSource = fs.readFileSync(decodedPath, "utf-8");
    

    // Note: 외부에서 MDX에 접근해서 content, frontmatter 추출하는 경우 compileMDX 사용
    const { content, frontmatter } = await compileMDX({
        source: markdownSource,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: []
          }
        }
      });

      /* Note: MDXRemote만 사용하는 경우 
            <MDXRemote source={markdownsource} ...  /> 이렇게 사용.
      */
    return { markdownSource, content, frontmatter };
  } catch (error) {
    console.error('getArticle error --- ', error);
    return { markdownSource: '', content: '', frontmatter: {} };
  }
}


// 파일 및 디렉토리 구조를 탐색하여 객체로 반환하는 함수
export const getDirectoryStructure = (dirPath: string): MenuTreeNode[] | undefined =>  {
  try {
    const baseUrl = path.join('posts');
    /*
        구조 예시 -
          ./src/posts
                  articles
                  test
        ex. dirPath = './src/posts'
        fs.readdirSync(dirPath) -> ['articles', 'test'] (해당 경로의 하위 directory/file 배열로 반환)
    */

    const menuList = fs.readdirSync(dirPath) // fs.readdirSync - 해당 경로 '하위'의 directory 배열로 반환.
      .map((item: string) => {
        const itemPath = path.join(dirPath, item);
        const itemStat = fs.statSync(itemPath);
        return {
          title: path.basename(itemPath),
          urlPath: '/blog' + itemPath.substring(itemPath.indexOf(baseUrl) + baseUrl.length), // baseUrl 이후의 경로만 반환
          children:(itemStat.isDirectory()) ? getDirectoryStructure(itemPath) : [],
          isDirectory: itemStat.isDirectory(),
        };
        
      }).filter((item: MenuTreeNode) => item.isDirectory); //디렉토리만 출력
      
      // console.log('menuList --- ', JSON.stringify(menuList, null, 2));

    return menuList;
  } catch (error) {
    console.error('getDirectoryStructure error --- ', error);
    return [];
  }

}
