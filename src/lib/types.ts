export type MenuTreeNode = {
    title: string;
    urlPath: string;
    children?: MenuTreeNode[];
    isDirectory?: boolean;
}

export type ArticlesList = {
    title: string;
    urlPath: string;
    frontmatter: Frontmatter;
}

export type Frontmatter = {
    title: string;
    date: string;
    description?: string;
    thumbnail?: string;
}