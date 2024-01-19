import type { Chapter } from "../../types/NovelData";

export function renderChapter(chapter: Chapter, includeDate: boolean = false, includeSourceUrl: boolean = false) {
    
    return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
        <head>
        <meta charset="UTF-8" />
        <title>${chapter.metaData.title}</title>
        </head>
      <body>
        <h1>${chapter.metaData.title}</h1>
        ${includeDate ? `<p>${chapter.metaData.date}</p>` : ""}
        ${includeSourceUrl ? `<p>Publication Date: ${chapter.metaData.url}</p>` : ""}

        ${chapter.content.map((paragraph) => `<p>${paragraph}</p>`).join("\n")}

      </body>
      </html>
    `;
  }