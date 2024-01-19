import type { NovelData } from "../../types/NovelData";
import { escapeXml } from "../utils";

export function content(novel: NovelData, coverPath: string, coverMimeType: string) {

    return `<?xml version="1.0" encoding="UTF-8"?>
<package
  xmlns="http://www.idpf.org/2007/opf"
  xmlns:opf="http://www.idpf.org/2007/opf"
  version="3.0"
  unique-identifier="BookId"
  >
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    ${/* @TODO figure out the ID stuff */ ""}
    <dc:identifier id="BookId">${Date.now()}</dc:identifier>
      <meta refines="#BookId" property="identifier-type" scheme="onix:codelist5">22</meta>
      <meta property="dcterms:identifier" id="meta-identifier">BookId</meta>
    
    <dc:title>${escapeXml(novel.title)}</dc:title>
    <dc:language>en</dc:language>
    ${novel.description ? `<dc:description>${escapeXml(novel.description)}</dc:description>` : ""}
    <dc:creator id="creator">${escapeXml(novel.author)}</dc:creator>
    <opf:meta name="cover" content="coverImg" />

    <meta property="dcterms:modified">${Date.now()}</meta>
  </metadata>

    <manifest>
      <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav" />
      <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" />
      <item id="coverImg" href="${coverPath}" media-type="${coverMimeType}" properties="cover-image"/>

      
      ${novel.chapters
          .map(
              (chapter) =>
                  `<item
              id="chapter-${chapter.metaData.id}"
              href="${chapter.metaData.id}.xhtml"
              media-type="application/xhtml+xml"
            />`
          )
          .join("\n")}
    </manifest>
    <spine>
      <itemref idref="cover" />
      <itemref idref="toc"/>
      ${novel.chapters.map((chapter) => `<itemref idref="chapter-${chapter.metaData.id}" />`).join("\n")}
    </spine>
    <guide>
      <reference title="Table of content" type="toc" href="toc.xhtml"/>
    </guide>
</package>
  `;
}
