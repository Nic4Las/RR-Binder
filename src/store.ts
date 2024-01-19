import { writable, type Writable } from "svelte/store";
import type { NovelPreviewData } from "./types/NovelData";

export const currentNovel: Writable<NovelPreviewData> = writable();
