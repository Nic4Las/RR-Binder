import type { NovelData } from "../../types/NovelData";
import { escapeXml } from "../utils";

export default function toc(novel: NovelData) {
  return `<?xml version='1.0' encoding='UTF-8'?>
    <html xmlns:epub="http://www.idpf.org/2007/ops" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <title>Table of Contents</title>
      <meta charset="UTF-8" />
    </head>
    <body>
      <h1>Table of Contents</h1>
      <nav id="toc" epub:type="toc">
        <ol>
          <li><a href="toc.xhtml">Table of Contents</a></li>
          ${novel.chapters
            .map(
              (chapter) =>
                // prettier-ignore
                `<li id="chapter-${chapter.metaData.id}"><a epub:type="bodymatter" href="${chapter.metaData.id}.xhtml">${escapeXml(chapter.metaData.title)}</a></li>`
            )
            .join("\n")}
        </ol>
      </nav>
    </body>
    </html>
  `;
}
