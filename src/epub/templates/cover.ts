import type { NovelData } from "../../types/NovelData";
import { escapeXml } from "../utils";

export default function toc(novel: NovelData, coverPath: string, includeDescription: boolean = true) {
    return `<?xml version='1.0' encoding='UTF-8'?>
      <html xmlns:epub="http://www.idpf.org/2007/ops" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Cover</title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <img src="${coverPath}" alt="Cover" />
        
        <h1>${novel.title}</h1>
        <h2>${novel.author}</h2>


        ${includeDescription ? `<h3>Description:</h3> <p>${escapeXml(novel.description)}</p>` : ""}

      </body>
      </html>
    `;
}
