import { ArticlesList } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function ArticlesListItem({
  urlPath,
  title,
  frontmatter,
}: ArticlesList) {
  const getThumbnailSrc = (fileName?: string) => {
    // Note: Next에서 이미지 가져올 때 public 경로 제외하고 가져와야함.
    if (!fileName) return "/thumbnail/default.png";
    return `/thumbnail/${fileName}`;
  };

  return (
    <li key={urlPath + title} className="mb-4">
      <Link href={urlPath}>
        <div className="flex flex-col border-b sm:flex-row sm:items-center sm:items-start bg-white p-4">
          {/* Text Content */}
          <div className="flex-1 sm:pr-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {frontmatter.title ?? title}
            </h2>
            {/* <div className="text-gray-600 mt-2">
              {frontmatter.description ?? "No description available."}
            </div> */}
            <div
              className="text-gray-600 mt-2"
              dangerouslySetInnerHTML={{
                __html: frontmatter.description ?? "No description available.",
              }}
            />
            <p className="text-sm text-gray-400 mt-1">{frontmatter.date}</p>
          </div>

          {/* Thumbnail Image */}
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <img
              className="w-full sm:w-48 h-auto rounded object-cover"
              src={getThumbnailSrc(frontmatter?.thumbnail)}
              alt={frontmatter.title ?? title}
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
