import type { Chapter } from "../../types/NovelData";
import { escapeXml } from "../utils";

export function renderChapter(chapter: Chapter, includeDate: boolean = false, includeSourceUrl: boolean = false) {
    
    return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
        <head>
        <meta charset="UTF-8" />
        <title>${escapeXml(chapter.metaData.title)}</title>
        </head>
      <body>
        <h1>${escapeXml(chapter.metaData.title)}</h1>
        ${includeDate ? `<p>${escapeXml(chapter.metaData.date)}</p>` : ""}
        ${includeSourceUrl ? `<p>Publication Date: ${escapeXml(chapter.metaData.url)}</p>` : ""}

        ${chapter.content.map((paragraph) => `<p>${escapeXml(paragraph)}</p>`).join("\n")}

      </body>
      </html>
    `;
  }