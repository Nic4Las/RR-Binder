<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import { Progress } from "$lib/components/ui/progress";
    import { toast } from "svelte-sonner";
    import { Loader, Check } from "lucide-svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";

    import { pRateLimit } from "p-ratelimit";

    import { currentNovel } from "../store";

    // import { RateLimit } from "sema4";
    import type { ChapterMetaData } from "../types/NovelData";
    import type { Chapter } from "../types/NovelData";
    import type { NovelData } from "../types/NovelData";
    import type { NovelChunk } from "../types/NovelChunk";
    import ChapterTable from "./ChapterTable.svelte";
    import { bindEpub } from "../epub/binder";

    let fromBeginning: boolean = false;
    let toEnd: boolean = false;
    let singleFile: boolean = false;

    let start = 1;
    let end = $currentNovel.chaptersMetaData.length;
    let chunkSize = 100;

    let chunks: NovelChunk[] = [];

    const parser = new DOMParser();
    const limit = pRateLimit({
        interval: 9000, // 1000 ms == 1 second
        rate: 6, // 30 API calls per interval
        concurrency: 4, // no more than 10 running at once
    });

    const getChunks = (): NovelChunk[] => {
        let chunks: NovelChunk[] = [];

        let numericStart = Number(start);
        let numericEnd = Number(end);
        let numericChunkSize = Number(chunkSize);

        let startIndex = fromBeginning ? 0 : numericStart - 1;
        startIndex = Math.max(0, startIndex);
        let endIndex = toEnd ? $currentNovel.chaptersMetaData.length : numericEnd;
        numericChunkSize = Math.max(1, numericChunkSize);

        if (startIndex >= endIndex) {
            toast.error("Start index cannot be greater or equal to end index");
            return chunks;
        }

        let allChapters = $currentNovel.chaptersMetaData.slice(startIndex, endIndex);

        if (singleFile || numericChunkSize > endIndex - startIndex) {
            // start: number;
            // end: number;
            // chapters: ChapterMetaData[];
            // name: string;
            // progress: ChunkProgress;
            // blob: Blob | null;

            chunks.push({
                start: startIndex,
                end: endIndex,
                chapters: allChapters,
                name: `Chapters ${startIndex + 1} to ${allChapters.length}`,
                progress: {
                    progress: 0,
                    total: allChapters.length,
                    done: false,
                },
                blob: null,
            });

            return chunks;
        }

        for (let i = 0; i < allChapters.length; i += numericChunkSize) {
            let chunk = allChapters.slice(i, i + numericChunkSize);
            chunks.push({
                start: startIndex + i,
                end: startIndex + i + numericChunkSize,
                chapters: chunk,
                name: `Chapters ${startIndex + i + 1} to ${startIndex + i + chunk.length}`,
                progress: {
                    progress: 0,
                    total: chunk.length,
                    done: false,
                },
                blob: null,
            });
        }

        return chunks;
    };

    const fetchChunk = async (chunk: NovelChunk): Promise<NovelData | undefined> => {
        let promises: Promise<[string, ChapterMetaData]>[] = [];
        let chapters: Chapter[] = [];

        for (let chapter of chunk.chapters) {
            let corsUrl = `https://corsproxy.io/?${encodeURIComponent(chapter.url)}`;
            // let corsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(chapter.url)}`;
            // let corsUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(chapter.url)}`;
            // let corsUrl = `https://cors-anywhere.herokuapp.com/corsdemo{encodeURIComponent(chapter.url)}`;
            // let corsUrl = `https://12ft.io/${encodeURIComponent(chapter.url)}`;
            // let corsUrl = `https://crossorigin.me/${encodeURIComponent(chapter.url)}`;

            // console.log(chapter.url);
            // console.log(`https://corsproxy.io/?${encodeURIComponent(chapter.url)}`)

            let promise: Promise<[string, ChapterMetaData]> = limit(() =>
                fetch(corsUrl)
                    .then((res) => res.text())
                    .then((html) => {
                        chunk.progress.progress = chunk.progress.progress + 1;
                        chunks = chunks;
                        return html;
                    })
                    .then((html) => [html, chapter]),
            );
            promises.push(promise);
        }

        await Promise.all(promises).then((res) => {
            for (let [chapterHtml, ChapterMetaData] of res) {


                let secretDisplayClass = "";

                // find class of secret display class using first capture group of following regex <style>\n.*\.(.*){
                let secretDisplayMatch = chapterHtml.match(/<style>\n.*\.(.*){\n.*display: none/);
                if (secretDisplayMatch != null) {
                    secretDisplayClass = secretDisplayMatch[1];
                }

                // console.log(secretDisplayClass);

                let chapterDoc = parser.parseFromString(chapterHtml, "text/html");

                // authorNotes = soup.find_all('div', class_='author-note-portlet')
                let authorNotesElements = chapterDoc.querySelectorAll("div.author-note-portlet");
                let authorNotes: string[] = [];
                authorNotesElements.forEach((note) => {
                    if (note != null) {
                        authorNotes.push(note.textContent != null ? note.textContent.trim() : "");
                    }
                });

                // paragraphs = soup.find('div', class_='chapter-inner chapter-content').find_all('p')
                // and exclude paragraphs with the secret display class
                let paragraphSelectorQuery = secretDisplayClass != "" ? `p:not(.${secretDisplayClass})` : "p";
                // console.log(paragraphSelectorQuery);
                let paragraphElements = chapterDoc
                    .querySelector("div.chapter-inner.chapter-content")
                    ?.querySelectorAll(paragraphSelectorQuery);
                let content: string[] = [];

                // check if the element is not null and dose not have a style of display none
                paragraphElements?.forEach((p) => {
                    if (p != null) {
                        content.push(p.textContent != null ? p.textContent.trim() : "");
                    }
                });

                // console.log(content)

                chapters.push({
                    content: content,
                    authorNotes: authorNotes,
                    metaData: ChapterMetaData,
                });
            }
        });

        return {
            title: $currentNovel.title,
            author: $currentNovel.author,
            url: $currentNovel.url,
            tags: $currentNovel.tags,
            cover: $currentNovel.cover,
            description: $currentNovel.description,
            chapters: chapters,
        };
    };

    const download = async () => {
        chunks = getChunks();

        // console.log(chunks);

        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];

            let novelData = await fetchChunk(chunk);

            if (novelData == undefined) {
                toast.error("Failed to fetch chunk");
                return;
            }

            // let blob = new Blob([JSON.stringify(novelData)], { type: "application/json" });
            let blob = bindEpub(novelData);
            chunk.blob = await blob;

            chunk.progress.done = true;
            chunk.progress.progress = chunk.progress.total;
            chunks = chunks;
        }
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
    };

    const downloadChunk = (chunk: NovelChunk) => {
        if (chunk.blob == null) {
            toast.error("Chunk has no blob");
            return;
        }

        downloadBlob(chunk.blob, `${$currentNovel.title} - ${chunk.name}.epub`);
    };
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Chunked Downloader</Card.Title>
        <Card.Description>Download Chapters in Chunks</Card.Description>
    </Card.Header>

    <Card.Content>
        <div class="grid md:grid-cols-3 gap-4">
            <div class="grid-cols-1 gap-y-4">
                <div class="col-span-1">
                    <Label>Start</Label>
                    <Input type="number" min={1} step={1} bind:value={start} bind:disabled={fromBeginning} />
                </div>

                <div class="col-span-1">
                    <Checkbox id="fromBeginning" bind:checked={fromBeginning}>From Beginning</Checkbox>
                    <Label for="fromBeginning">From Beginning</Label>
                </div>
            </div>

            <div class="grid-cols-1 gap-y-4">
                <div class="col-span-1">
                    <Label>End</Label>
                    <Input type="number" min={1} step={1} bind:value={end} bind:disabled={toEnd} />
                </div>

                <div class="col-span-1">
                    <Checkbox id="toEnd" bind:checked={toEnd}>To End</Checkbox>
                    <Label for="toEnd">To End</Label>
                </div>
            </div>

            <div class="grid-cols-1 gap-y-4">
                <div class="col-span-1">
                    <Label>Chunk Size</Label>
                    <Input type="number" min={1} step={1} bind:value={chunkSize} bind:disabled={singleFile} />
                </div>

                <div class="col-span-1">
                    <Checkbox id="singleFile" bind:checked={singleFile}></Checkbox>
                    <Label for="singleFile">Single File</Label>
                </div>
            </div>

            <div class="col-span-3 flex justify-center">
                <Button id="export" on:click={download}>Download</Button>
            </div>

            <div class="h-96 rounded-md border col-span-3">
                <div class="grid columns-1 gap-6 p-6 overflow-y-scroll h-full">
                    <h3 class="pb-4">Progress of chunks</h3>

                    {#each chunks as chunk}
                        <div class="grid grid-cols-1 gap-2">
                            <div
                                class="grid grid-cols-[minmax(50px,5%),minmax(0,80%),minmax(100px,15%)] gap-y-4 gap-x-2 place-items-center"
                            >
                                <div>
                                    {#if chunk.progress.done}
                                        <Check class="text-primary" />
                                    {:else}
                                        <Loader class="animate-spin text-primary" />
                                    {/if}
                                </div>

                                <div class="w-full">
                                    <Tooltip.Root>
                                        <Tooltip.Trigger class="w-full">
                                            <div class="w-full grid grid-cols-1 gap-2">
                                                <div class="grid grid-cols-2">
                                                    <Label class="place-self-start pl-4">{chunk.name}</Label>
                                                    <Label class="place-self-end pr-4">
                                                        {chunk.progress.progress} of {chunk.progress.total}
                                                    </Label>
                                                </div>
                                                <Progress bind:value={chunk.progress.progress} max={chunk.progress.total} />
                                            </div>
                                        </Tooltip.Trigger>

                                        <Tooltip.Content>
                                            <p>{chunk.progress.progress} of {chunk.progress.total}</p>
                                        </Tooltip.Content>
                                    </Tooltip.Root>
                                </div>

                                <div>
                                    <Button
                                        variant="ghost"
                                        disabled={!chunk.progress.done}
                                        on:click={(e) => downloadChunk(chunk)}>Download</Button
                                    >
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- A Box that looks like a Terminal separate spinner and proges bars for each chunk -->
    </Card.Content>
</Card.Root>
