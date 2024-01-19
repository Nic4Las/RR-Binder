<script lang="ts">
    import nocoverUrl from "../../public/nocover.png";

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
    import { getCoverBlob, getNovelInfos } from "./utils";

    const performSearch = () => {
        let inputElement = document.getElementById("searchInput") as HTMLInputElement;
        let input = inputElement.value;
        let url = new URL(input);
        if (url.hostname === "www.royalroad.com") {
            getNovelInfos(url.href);
        }
    };

    const searchButtonEnter = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            performSearch();
        }
    };
</script>

<div class="flex justify-between items-center w-full">
    <div class="flex border-b px-2 w-full md:w-1/2 mx-auto items-center min-w-96">
        <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <!-- <Separator orientation="vertical" /> -->
        <input
            id="searchInput"
            type="text"
            class="flex-grow bg-transparent outline-none"
            placeholder="Novel URL"
            on:keydown={searchButtonEnter}
        />
        <Button variant="ghost" class="ml-2" on:click={performSearch}>Grab Novel Information</Button>
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
