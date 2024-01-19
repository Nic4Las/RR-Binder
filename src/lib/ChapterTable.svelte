<script lang="ts">
    import { currentNovel } from "../store";
    import type { NovelPreviewData, ChapterMetaData } from "../types/NovelData";
    import { Loader } from "lucide-svelte";

    import * as Table from "$lib/components/ui/table";

    const openInNewTab = (url: string) => {
        window.open(url, "_blank");
    };
</script>

<div >
    <Table.Root>
        <Table.Caption>All currently available Chapters.</Table.Caption>
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-[100px]">Chapter Nr.</Table.Head>
                <Table.Head class="w-[100px]">Published date</Table.Head>
                <Table.Head class="w-[250px]">Name</Table.Head>
                <Table.Head>Link</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each $currentNovel.chaptersMetaData as chapter}
                <Table.Row>
                    <Table.Cell class="font-medium">{chapter.order + 1}</Table.Cell>
                    <Table.Cell>{new Date(chapter.date).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{chapter.title}</Table.Cell>
                    <Table.Cell>
                        <div class="cursor-pointer" on:click={(e) => openInNewTab(chapter.url)}>open</div>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
