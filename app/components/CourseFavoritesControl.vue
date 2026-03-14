<template>
  <div
    class="flex flex-row flex-wrap max-sm:px-2 justify-between my-4 max-w-3xl mx-auto gap-2.5"
  >
    <div>
      <USelectMenu
        v-model="selectedTermItems"
        :items="dropdownTermOptions"
        multiple
        size="lg"
        class="w-64"
        :ui="{
          item: 'flex item-center p-0! rounded cursor-pointer hover:bg-primary/10 data-selected:bg-primary/20 data-selected:text-primary',
          itemWrapper: 'max-w-[calc(100%-2rem)]',
          itemLabel: 'w-full pl-2 py-2',
          itemTrailing: 'my-auto',
          separator: 'last:hidden',
          label: 'px-2 py-1 text-xs text-dimmed',
        }"
        :search-input="false"
        @change="termChangeHandler"
      >
        <template #item-label="{ item }">
          <span class="flex justify-between items-center w-full">
            <span>{{ item.label }}</span>
            <div>
              <UBadge
                v-if="item.value === defaultTerm"
                color="warning"
                variant="soft"
                size="sm"
                class="ml-2"
              >
                預設學期
              </UBadge>
              <UBadge
                v-if="dataAllTerms[item.value]?.length || 0 > 0"
                color="primary"
                variant="soft"
                size="sm"
                class="ml-2"
              >
                {{ `${dataAllTerms[item.value]?.length || 0} 門課` }}
              </UBadge>
              <UBadge
                v-else
                color="neutral"
                variant="soft"
                size="sm"
                class="ml-2"
              >
                未載入
              </UBadge>
            </div>
          </span>
        </template>
      </USelectMenu>
    </div>
    <div class="flex flex-row gap-2">
      <UButton
        label="全部展開"
        size="lg"
        color="primary"
        variant="outline"
        @click="allOpen"
      ></UButton>
      <UButton
        label="全部收合"
        size="lg"
        color="primary"
        variant="outline"
        @click="allClosed"
      ></UButton>
      <UButton
        v-if="!shared"
        label="匯出"
        color="neutral"
        variant="outline"
        icon="tabler:upload"
        class="h-9 cursor-pointer"
        @click="exportFavorites"
      />
    </div>
    <UModal
      title="匯出收藏課程"
      :description="'匯出包含 ' + favoriteCourses.length + ' 門課程的連結'"
      :ui="{
        header: 'py-2',
        body: 'flex flex-col gap-4 !pt-2',
        description: 'whitespace-pre-line pr-8',
      }"
      v-model:open="exportModalOpen"
      scrollable
    >
      <template #body>
        <UFormField label="為這些課程命名">
          <UInput
            v-model="includeTitleInExport"
            placeholder="選填，例如：神奇的收藏課表、116資工雙主修"
            class="w-full"
            color="neutral"
            variant="outline"
            @update:model-value="exportFavorites"
          >
            <template v-if="includeTitleInExport?.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                icon="tabler:x"
                aria-label="Clear input"
                @click="includeTitleInExport = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="加上你的暱稱">
          <UInput
            v-model="includeAuthorInExport"
            placeholder="選填，分享時會顯示在作者欄位"
            class="w-full"
            color="neutral"
            variant="outline"
            @update:model-value="exportFavorites"
          >
            <template v-if="includeAuthorInExport?.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                icon="tabler:x"
                aria-label="Clear input"
                @click="includeAuthorInExport = ''"
              />
            </template>
          </UInput>
        </UFormField>
        <UInput
          v-model="exportUrl"
          label="分享連結（點擊複製）"
          readonly
          @click="copyToClipboard(exportUrl, '分享連結')"
          class="w-full"
          color="neutral"
          variant="outline"
          :ui="{ base: 'select-all! cursor-pointer' }"
        />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { FavoriteCourses } from "@/composables/useFavorites";

const { favoriteCourses, shared } = defineProps<{
  favoriteCourses: FavoriteCourses;
  shared?: boolean | undefined;
}>();

const dataAllTerms = useState<AllTermsData>("dataAllTerms", () => ({}));

const config = useRuntimeConfig();
const termList = useState<string[]>("termList", () =>
  config.public.ntnuxTerms
    ? ((config.public.ntnuxTerms as String) || "")
        .split(",")
        .map((term: string) => term.trim())
    : [],
);
const defaultTerm = useState<string>(
  "defaultTerm",
  () => (config.public.ntnuxDefaultTerm as string) || "",
);
const selectedTermItems = ref([
  {
    label: defaultTerm.value.replace("3", "暑期"),
    value: defaultTerm.value,
  },
]);
const selectedTerm = useState<string[]>("selectedTerm", () => [
  defaultTerm.value,
]);
const dropdownTermOptions = computed(() => {
  return termList.value
    .map((year) => {
      return [
        {
          type: "label",
          label: `${year} 學年`,
        },
        { label: `${year}-1`, value: `${year}-1` },
        { label: `${year}-2`, value: `${year}-2` },
        { label: `${year}-暑期`, value: `${year}-3` },
        { type: "separator" },
      ];
    })
    .flat() as any[];
});

const selectedFavorite = useState<string[]>("selectedFavorite", () => []);
function allClosed() {
  selectedFavorite.value = [];
}
function allOpen() {
  // Array: 0 - favoriteCourses.length - 1
  selectedFavorite.value = favoriteCourses.map((_, index) => index.toString());
}

function termChangeHandler() {
  selectedTerm.value = selectedTermItems.value.map((item) => item.value);
  for (const term of selectedTerm.value) {
    if (!dataAllTerms.value[term]) {
      fetchTermData(term);
    }
  }
}

const exportModalOpen = ref(false);
const exportUrl = ref("");
const includeTitleInExport = ref("");
const includeAuthorInExport = ref("");
function exportFavorites() {
  if (favoriteCourses.length === 0) {
    alert("沒有課程可供匯出");
    return;
  }
  exportModalOpen.value = true;
  exportUrl.value =
    window.location.origin +
    "/share/favorites?cs=" +
    favoriteCourses.join(",") +
    (includeTitleInExport.value.trim() !== ""
      ? `&title=${encodeURIComponent(includeTitleInExport.value.trim())}`
      : "") +
    (includeAuthorInExport.value.trim() !== ""
      ? `&a=${encodeURIComponent(includeAuthorInExport.value.trim())}`
      : "");
}
</script>
