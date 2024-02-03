import type { Chapter, NovelData } from "../types/NovelData";
import { container } from "./templates/container";
import { content } from "./templates/content";
import toc from "./templates/toc";
import { renderChapter } from "./templates/chapter";
import JSZip from "jszip";
import cover from "./templates/cover";

import { currentNovel } from "../store";
import { getCoverBlob } from "$lib/utils";

export async function bindEpub(novel: NovelData) {
    let zip = new JSZip();    

    let coverBlob = await getCoverBlob(novel.cover);
    let coverFileExt = coverBlob.type.split("/")[1];
    let coverFilePath = `cover.${coverFileExt}`;

    let containerStr = container();
    let contentStr = content(novel, coverFilePath, coverBlob.type);
    let tocStr = toc(novel);
    let coverStr = cover(novel, coverFilePath);
    let chapterStrs = novel.chapters.map((chapter) => renderChapter(chapter));

    // console.log(containerStr);
    // console.log(contentStr);
    // console.log(tocStr);
    // console.log(coverStr);
    // console.log(chapterStrs);

    

    zip.file("mimetype", "application/epub+zip");
    zip.file("META-INF/container.xml", container());
    zip.file("OEBPS/cover.xhtml", cover(novel, coverFilePath));
    zip.file("OEBPS/content.opf", content(novel, coverFilePath, coverBlob.type));
    zip.file("OEBPS/toc.xhtml", toc(novel));
    zip.file(`OEBPS/${coverFilePath}`, coverBlob);

    novel.chapters.forEach((chapter) => {
        zip.file(`OEBPS/${chapter.metaData.id}.xhtml`, renderChapter(chapter));
    });

    // console.log("added files to zip. generating blob...");

    let blob = zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" })

    return blob;
}
