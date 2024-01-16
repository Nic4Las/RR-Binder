<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import ChapterTable from "./ChapterTable.svelte";
    import NovelChunkedExporter from "./NovelChunkedExporter.svelte";
</script>

<!-- <Tabs.Root value="account" class="w-[400px]">
  <Tabs.List>
    <Tabs.Trigger value="Chapters">Account</Tabs.Trigger>
    <Tabs.Trigger value="Chunked Download">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    Make changes to your account here.
  </Tabs.Content>
  <Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root> -->

<Tabs.Root value="overview" class="px-6">
    <Tabs.List>
        <Tabs.Trigger value="overview">Chapter Overview</Tabs.Trigger>
        <Tabs.Trigger value="chunked">Chunked Export</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="overview">
        <ChapterTable />
    </Tabs.Content>

    <Tabs.Content value="chunked">
        <NovelChunkedExporter />
    </Tabs.Content>
</Tabs.Root>
