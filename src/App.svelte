<script lang="ts">
    import NovelSearch from "./lib/NovelSearch.svelte";
    import NovelInfo from "./lib/NovelInfo.svelte";
    import ChapterTable from "./lib/ChapterTable.svelte";
    import OverviewAndDownload from "./lib/OverviewAndDownload.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
    import { currentNovel } from "./store";
    import { Loader, Check } from "lucide-svelte";

    import { onMount } from "svelte";
    import { getNovelInfos } from "$lib/utils";

    onMount(() => {

        let lastUrl = localStorage.getItem("lastNovelUrl") ?? "https://www.royalroad.com/fiction/21220/mother-of-learning";

        getNovelInfos(lastUrl);
    });
</script>

<main>
    <div class="grid gap-6 grid-cols-1">
        <ModeWatcher />

        <NovelSearch />

        {#if $currentNovel != null}
            <NovelInfo />

            <OverviewAndDownload />

        {:else}
            <!-- show spinner -->
            <div class="flex justify-center items-center w-full h-96">
                <Loader class="animate-spin" />
            </div>

        {/if}

        <!-- <ChapterTable /> -->
    </div>

    <Toaster />
</main>

<!-- make the background of the html black -->
