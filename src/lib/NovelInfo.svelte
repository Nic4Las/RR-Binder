<script lang="ts">
    import { currentNovel } from "../store";

    let shownDescription: string = "";
</script>

<section class="grid gap-6 lg:grid-cols-2">
    <div class="overflow-hidden rounded-md">
        <img src={$currentNovel.cover} alt="cover" class="w-full max-h-96 object-contain" />
    </div>

    <div class="rounded-md">
        <div class="flex flex-col justify-between max-h-150 p-4">
            <div>
                <h1 class="text-2xl font-bold">{$currentNovel.title}</h1>
                <h2 class="text-xl font-semibold">{$currentNovel.author}</h2>

                <div class="grid grid-cols-5 pt-8 gap-2" >
                    <!-- crate a grid entry for each tag -->
    
                    {#each $currentNovel.tags as tag}
                        <div class="bg-primary text-primary-foreground rounded-full text-center align-middle overflow-hidden h-8">
                            {tag}
                        </div>
                    {/each}
                </div>

                <!-- show part of the description and a more ... button to reveal the entire description and a show less button to only how the small description again -->
                <p class="mt-4 whitespace-pre-line">
                    {#if shownDescription.length > 0}
                        {shownDescription}
                        <button
                            class="text-primary"
                            on:click={() => {
                                shownDescription = "";
                            }}
                        >
                            show less
                        </button>
                    {:else}
                        {#if $currentNovel.description.length > 512}
                            {$currentNovel.description.substr(0, 512)}
                            <button
                                class="text-primary"
                                on:click={() => {
                                    shownDescription = $currentNovel.description;
                                }}
                            >
                                more ...
                            </button>
                        {:else}
                            {$currentNovel.description}
                        {/if}
                    {/if}
                </p>


                <!-- <p class="mt-4 whitespace-pre-line">{$currentNovel.description}</p> -->
            </div>
            
        </div>
    </div>
</section>
