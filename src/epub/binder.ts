import type { Chapter, NovelData } from "../types/NovelData";
import { container } from "./templates/container";
import { content } from "./templates/content";
import toc from "./templates/toc";
import { renderChapter } from "./templates/chapter";
import JSZip from "jszip";

export async function bindEpub(novel: NovelData) {
    let zip = new JSZip();

    let containerStr = container();
    let contentStr = content(novel);
    let tocStr = toc(novel);
    let chapterStrs = novel.chapters.map((chapter) => renderChapter(chapter));

    // console.log(containerStr);
    // console.log(contentStr);
    // console.log(tocStr);
    // console.log(chapterStrs);

    

    zip.file("mimetype", "application/epub+zip");
    zip.file("META-INF/container.xml", container());
    zip.file("OEBPS/content.opf", content(novel));
    zip.file("OEBPS/toc.xhtml", toc(novel));

    novel.chapters.forEach((chapter) => {
        zip.file(`OEBPS/${chapter.metaData.id}.xhtml`, renderChapter(chapter));
    });

    // console.log("added files to zip. generating blob...");

    let blob = zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" })

    return blob;
}
