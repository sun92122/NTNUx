<template>
  <div
    class="course-carousel-container w-full flex flex-col items-center justify-center py-6 overflow-hidden"
  >
    <!-- title -->
    <div class="md:text-lg font-bold mb-2">
      {{ year }} 學年度第 {{ semester }} 學期
    </div>
    <div class="text-lg md:text-4xl font-bold mb-6">選課日程</div>

    <!-- carousel -->
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      :items="carouselItem"
      class-names
      prev-icon="tabler:arrow-narrow-left"
      next-icon="tabler:arrow-narrow-right"
      class="mx-auto max-w-[98vw] w-240"
      :ui="{
        viewport: 'overflow-visible hide-scrollbar',
        container: 'ms-0',
        item: 'h-auto basis-xs ps-0 w-xs',
      }"
    >
      <UCard
        variant="soft"
        class="mx-2 bg-white dark:bg-gray-800 shadow-md"
        :class="item.title ? '' : 'collapse'"
        :ui="{
          header: 'border-b-0',
          body: 'border-b-0',
          footer: 'sm:px-4',
        }"
      >
        <template #header>
          <div
            class="flex flex-col text-lg font-bold items-center justify-center"
          >
            <div>
              {{ item?.title }}
            </div>
            <div>
              <span v-if="item.dateTime[0]?.time" class="text-sm text-dimmed">
                {{ item.dateTime[0]?.time }}
              </span>
              <span class="text-3xl" :style="{ color: item.color }">
                {{ item.dateTime[0]?.date }}
              </span>
              <span v-if="item.dateTime[1]" class="text-3xl"> - </span>
              <span
                v-if="item.dateTime[1]"
                class="text-3xl"
                :style="{ color: item.color }"
              >
                {{ item.dateTime[1]?.date }}
              </span>
              <span v-if="item.dateTime[1]?.time" class="text-sm text-dimmed">
                {{ item.dateTime[1]?.time }}
              </span>
            </div>
          </div>
        </template>

        <div class="h-60 select-none">
          <UTimeline
            v-if="item.step"
            :items="
              Array.from(
                item.step.entries().map(([index, step]) => ({
                  ...step,
                  icon: step.icon || `tabler:number-${index + 1}`,
                })),
              )
            "
            class="mt-4"
            :ui="{
              date: 'text-md',
              title: 'text-md',
              description: 'whitespace-pre-line',
              wrapper: 'pb-4',
            }"
            color="neutral"
          />
        </div>

        <template #footer>
          <div class="h-6">
            <UButton
              v-if="item.info"
              :label="item.info"
              :to="item.infoUrl"
              target="_blank"
              icon="tabler:external-link"
              variant="link"
              color="neutral"
            />
          </div>
        </template>
      </UCard>
    </UCarousel>
  </div>
</template>

<script lang="ts" setup>
import type { TimelineItem } from "@nuxt/ui";
import { jsonLzDecode } from "@/composables/useTools";

const carousel = useTemplateRef("carousel");
const config = useRuntimeConfig();

interface CourseCarouselItem {
  title?: string;
  dateTime: Array<{ date: string; time?: string }>;
  color: string;
  step?: TimelineItem[];
  info?: string;
  infoUrl?: string;
}
interface ScheduleData {
  year: string;
  term: string;
  items: CourseCarouselItem[];
}
const scheduleData = useState<ScheduleData>("schedule", () => {
  try {
    const parsed = jsonLzDecode(config.public.ntnuxScheduleLz) as ScheduleData;
    if (Array.isArray(parsed)) {
      return { year: "", term: "", items: parsed };
    } else {
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse schedule:", {
      error: e,
      rawData: config.public.ntnuxScheduleLz,
    });
    return { year: "", term: "", items: [] };
  }
});
const items = computed(() => scheduleData.value?.items || []);
const year = computed(() => scheduleData.value?.year || "");
const semester = computed(() => scheduleData.value?.term || "");
const carouselItem = computed<CourseCarouselItem[]>(() => {
  const emptyItem: CourseCarouselItem = {
    dateTime: [],
    color: "",
  };
  return [emptyItem, emptyItem, ...items.value, emptyItem, emptyItem];
});
</script>
