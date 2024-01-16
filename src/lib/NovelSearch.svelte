<script lang="ts">
    import { currentNovel } from "../store";

    import type { NovelPreviewData, ChapterMetaData } from "../types/NovelData";
    import { Progress } from "$lib/components/ui/progress";
    import { Search } from "lucide-svelte";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card";
    import { onMount } from "svelte";

    import { Sun, Moon } from "lucide-svelte";

    import { toggleMode } from "mode-watcher";

    const parser = new DOMParser();

    let novelName: string = "";
    const getNovelInfos = async () => {
        let input = document.querySelector("input");
        let url = input != null ? input.value : "";

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

        console.log(novelData);
        currentNovel.set(novelData);
    };

    const searchButtonEnter = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            getNovelInfos();
        }
    };
</script>

<div class="flex justify-between items-center w-full">
    <div class="flex border-b px-2 w-full md:w-1/2 mx-auto items-center min-w-96">
        <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <!-- <Separator orientation="vertical" /> -->
        <input
            type="text"
            class="flex-grow bg-transparent outline-none"
            placeholder="Novel URL"
            on:keydown={searchButtonEnter}
        />
        <Button variant="ghost" class="ml-2" on:click={getNovelInfos}>Grab Novel Information</Button>
    </div>

    <!-- add a dark mode toggle in the top right -->
    <div class="">
        <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span class="sr-only">Toggle theme</span>
        </Button>
    </div>
</div>
