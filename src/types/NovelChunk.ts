import type { ChapterMetaData } from "./NovelData";

export type ChunkProgress = {
    done: boolean;
    progress: number;
    total: number;
};

export type NovelChunk = {
    start: number;
    end: number;
    chapters: ChapterMetaData[];
    name: string;
    progress: ChunkProgress;
    blob: Blob | null;
};