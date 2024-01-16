<script lang="ts">
    import NovelSearch from "./lib/NovelSearch.svelte";
    import NovelInfo from "./lib/NovelInfo.svelte";
    import ChapterTable from "./lib/ChapterTable.svelte";
    import OverviewAndDownload from "./lib/OverviewAndDownload.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import { ModeWatcher } from "mode-watcher";
</script>

<main>

    <div class="grid gap-6 grid-cols-1">
        <ModeWatcher />

        <NovelSearch />
        <NovelInfo />

        <OverviewAndDownload />


        <!-- <ChapterTable /> -->
    </div>

    <Toaster />
</main>

<!-- make the background of the html black -->