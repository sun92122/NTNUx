<template>
  <div>
    <UAccordion
      :items="accordionItems"
      v-model="accordionModel"
      type="multiple"
      trailingIcon="tabler:chevron-down"
      :ui="{
        trigger: 'cursor-default bg-gray-100 dark:bg-gray-700 px-4',
        body: 'text-md text-default px-4',
        trailingIcon: 'collapse',
      }"
    >
      <template #default="{ item, index, open }">
        <div class="ps-1.5">
          <span class="text-base">{{ item.label }}</span>
        </div>
      </template>

      <template #body="{ item, index, open, ui }">
        <span
          v-for="c in (item as AccordionItem).content?.split('\n') || []"
          v-html="c"
          class="ps-8 whitespace-pre-wrap inline-block"
        ></span>
      </template>
      <template #description-body="{ item, index, open, ui }">
        <span
          v-html="(item as AccordionItem).content"
          class="ps-8 whitespace-pre-wrap"
        ></span>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";
import type { Course } from "@/composables/useCourseTable";

const props = defineProps({
  course: {
    type: Object as () => Course | undefined,
    required: true,
  },
});
const course = computed(() => {
  return props.course;
});

const accordionItems = computed<AccordionItem[]>(() => [
  {
    label: "限修條件",
    icon: "tabler:alert-triangle",
    content: course.value?.restriction
      ? course.value.restriction
          .replace(/<\/br>/g, "\n")
          .replace(/(?<=.)◎/g, "\n◎")
      : "無",
    disabled: !course.value?.restriction,
  },
  {
    label: "備註",
    icon: "tabler:notes",
    content: course.value?.comment
      ? course.value.comment.replace(/<\/br>/g, "\n")
      : "無",
    disabled: !course.value?.comment,
  },
  {
    label: "課程簡介",
    icon: "tabler:bookmark",
    content: course.value?.description,
    disabled: !course.value?.description,
    slot: "description",
  },
]);
const accordionModel = ref<string[]>(
  accordionItems.value.reduce<string[]>((acc, item, index) => {
    if (!item.disabled) {
      acc.push(index.toString());
    }
    return acc;
  }, []),
);

watch(
  () => course.value?.description,
  () => {
    if (course.value?.description) {
      // If description becomes available, ensure the "課程簡介" section is open
      if (!accordionModel.value.includes("2")) {
        accordionModel.value.push("2");
      }
    } else {
      // If description becomes unavailable, remove the "課程簡介" section from the open state
      accordionModel.value = accordionModel.value.filter((key) => key !== "2");
    }
  },
);
</script>
