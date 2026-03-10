<template>
  <div class="flex flex-row flex-wrap max-sm:px-2 justify-between my-4 max-w-3xl mx-auto gap-2.5">
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
          itemLabel: 'w-full px-2 py-2',
          itemTrailing: 'my-auto',
          separator: 'last:hidden',
          label: 'px-2 py-1 text-xs text-dimmed',
        }"
        :search-input="false"
        @change="termChangeHandler"
      >
        <template #item-label="{ item }">
          <span
            v-if="dataAllTerms[item.value]?.length || 0 > 0"
            class="flex justify-between items-center w-full"
          >
            <span>{{ item.label }}</span>
            <UBadge color="primary" variant="soft" size="sm" class="ml-2">
              {{ `${dataAllTerms[item.value]?.length || 0} 門課` }}
            </UBadge>
          </span>
          <span v-else class="flex justify-between items-center w-full">
            <span>{{ item.label }}</span>
            <UBadge color="neutral" variant="soft" size="sm" class="ml-2">
              未載入
            </UBadge>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { favoriteCourses } from "@/composables/useFavorites";

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
  // Array: 0 - favoriteCourses.value.length - 1
  selectedFavorite.value = Array.from(
    { length: Object.keys(favoriteCourses.value).length },
    (_, i) => i.toString(),
  );
}

function termChangeHandler() {
  selectedTerm.value = selectedTermItems.value.map((item) => item.value);
  for (const term of selectedTerm.value) {
    if (!dataAllTerms.value[term]) {
      fetchTermData(term);
    }
  }
}
</script>
