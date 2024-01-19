import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import nocoverUrl from "../../public/nocover.png";
import type { ChapterMetaData, NovelPreviewData } from "../types/NovelData";
import { currentNovel } from "../store";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};

export const getCoverBlob = async (cover: string) => {
    let found = false
    let coverBlob = new Blob()
    coverBlob = await fetch(cover).then(res => {
        found = true
        return res.blob()
    });

    if (!found) {
        coverBlob = await fetch(nocoverUrl).then(res => {
            found = true
            return res.blob()
        })
    }

    return coverBlob
};

const parser = new DOMParser();

export const getNovelInfos = async (url:string) => {
    // let corsUrl = `https://api.allorigins.win/raw?url=${url}`;
    let corsUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

    console.log(corsUrl);

    let novelHtml = await fetch(corsUrl).then((res) => res.text());
    let novelDoc = parser.parseFromString(novelHtml, "text/html");

    let title = novelDoc.querySelector("div.fic-header h1")?.textContent;
    title = title != null ? title.trim() : "";

    let author = novelDoc.querySelector("div.fic-header a")?.textContent;
    author = author != null ? author.trim() : "";

    // use this regex window.fictionCover = (.*); to get the cover
    let cover = novelHtml.match(/window.fictionCover = (.*);/)?.[1];
    cover = cover != null ? cover.trim() : "";
    cover = cover.replace(/"/g, "").replace("covers-full", "covers-large");

    let tagsElements = novelDoc.querySelectorAll("span.tags a");
    let tags: string[] = [];
    tagsElements.forEach((tag) => {
        if (tag != null) {
            tags.push(tag.textContent != null ? tag.textContent.trim() : "");
        }
    });

    let descriptionStr = novelDoc.querySelector("div.description div.hidden-content")?.textContent;
    let description = descriptionStr != null ? descriptionStr.trim() : "";

    let chapterStr = novelHtml.match(/window.chapters = (.*);/)?.[1];
    let chaptersMetaData: ChapterMetaData[] = [];
    if (chapterStr != null) {
        let chapters = JSON.parse(chapterStr);
        chapters.forEach((chapter: any) => {
            let metaData: ChapterMetaData = {
                title: chapter.title,
                id: chapter.id,
                order: chapter.order,
                date: chapter.date,
                url: `https://www.royalroad.com${chapter.url}`,
                slug: chapter.slug,
            };
            chaptersMetaData.push(metaData);
        });
    }
    
    let novelData: NovelPreviewData = {
        title,
        author,
        url,
        tags,
        cover,
        description,
        chaptersMetaData,
    };

    window.localStorage.setItem("lastNovelUrl", url);
    console.log(novelData);
    currentNovel.set(novelData);
};