export type NovelPreviewData = {
    title: string;
    author: string;
    url: string;
    tags: string[];
    cover: string;
    description: string;
    chaptersMetaData: ChapterMetaData[];
};

export type NovelData = {
    title: string;
    author: string;
    url: string;
    tags: string[];
    cover: string;
    description: string;
    chapters: Chapter[];
};

export type ChapterMetaData = {
    title: string;
    id: number;
    order: number;
    date: string;
    url: string;
    slug: string;
};

export type Chapter = {
    content: string[];
    authorNotes: string[];
    metaData: ChapterMetaData;
}