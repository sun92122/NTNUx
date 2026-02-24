<template>
  <div
    class="course-carousel-container w-full flex flex-col items-center justify-center py-6"
  >
    <!-- title -->
    <div class="md:text-lg font-bold mb-2">
      {{ year }} 學年度第 {{ semester?.replace("3", "2") }} 學期
    </div>
    <div class="text-2xl font-bold mb-6">選課日程</div>

    <!-- carousel -->
    <UCarousel
      v-slot="{ item }"
      :items="items"
      arrows
      dots
      prev-icon="tabler:arrow-narrow-left"
      next-icon="tabler:arrow-narrow-right"
      :ui="{
        item: 'md:basis-1/3'
      }">
      <UCard variant="soft">
        <template #header>
          <div
            class="flex flex-col text-lg font-bold items-center justify-center"
          >
            <div>
              {{ item.title }}
            </div>
            <div>
              <span v-if="item.dateTime[0]?.time" class="text-sm">
                {{ item.dateTime[0]?.time }}
              </span>
              <span class="text-lg" :style="{ color: item.color }">
                {{ item.dateTime[0]?.date }}
              </span>
              <span v-if="item.dateTime[1]" class="text-lg"> - </span>
              <span
                v-if="item.dateTime[1]"
                class="text-lg"
                :style="{ color: item.color }"
              >
                {{ item.dateTime[1]?.date }}
              </span>
              <span v-if="item.dateTime[1]?.time" class="text-sm">
                {{ item.dateTime[1]?.time }}
              </span>
            </div>
          </div>
        </template>

        <Placeholder class="h-32" />

        <template #footer>
          <Placeholder class="h-8" />
        </template>
      </UCard>
    </UCarousel>
  </div>
</template>

<script lang="ts" setup>
const defaultTerm = useState<string>(
  "defaultTerm",
  () => process.env.NTNUX_DEFAULT_TERM || "",
);

const [year, semester] = defaultTerm.value.split("-");

interface CourseCarouselItem {
  title: string;
  dateTime: Array<{ date: string; time?: string }>;
  color: string;
  step: Array<{ title: string; description: string }>;
  info?: string;
  infoUrl?: string;
}
// test data
const items: CourseCarouselItem[] = [
  {
    title: "課程公告",
    dateTime: [
      {
        date: "114/7/1",
      },
    ],
    color: "#FF5733",
    step: [
      {
        title: "課程公告",
        description: "114/7/1",
      },
      {
        title: "課程預選",
        description:
          "1/5\n學士班舊生必修課程預選\n預選作業由課務組統一進行，學生無需於系統登記\n研究所以及課程開設條件未符預選規則的學士班課程 無 課程預選，同學需自行依系所規劃選課",
      },
    ],
  },
  {
    title: "第一階段網路初選",
    dateTime: [
      {
        date: "1/6",
        time: "09:00",
      },
      {
        date: "1/9",
        time: "23:59",
      },
    ],
    color: "#4CAF50",
    step: [
      {
        title: "第一階段選課",
        description: "1/6 - 1/9",
      },
      {
        title: "公告結果",
        description: "1/16 17:00",
      },
    ],
    info: "各學制選課注意事項",
    infoUrl:
      "https://www.aa.ntnu.edu.tw/zh_tw/selectives/Dayschool/Coursemethods",
  },
  {
    title: "第二階段網路選課",
    dateTime: [
      {
        date: "2/3",
        time: "09:00",
      },
      {
        date: "2/5",
        time: "23:59",
      },
    ],
    color: "#2196F3",
    step: [
      {
        title: "第二階段選課",
        description: "2/3 - 2/5",
      },
      {
        title: "公告結果",
        description: "2/13 17:00",
      },
    ],
    info: "各學制選課注意事項",
    infoUrl:
      "https://www.aa.ntnu.edu.tw/zh_tw/selectives/Dayschool/Coursemethods",
  },
  {
    title: "全校加退選",
    dateTime: [
      {
        date: "2/23",
        time: "09:00",
      },
      {
        date: "3/8",
        time: "23:59",
      },
    ],
    color: "#9C27B0",
    step: [
      {
        title: "非臺大系統校際課程申請",
        description: "2/9 - 3/9",
      },
      {
        title: "全校加退選",
        description:
          "2/23 - 3/8\n即時線上選課\n授權碼線上加選、特殊原因紙本專案申請",
      },
      {
        title: "僅能課程加選",
        description: "3/9",
      },
    ],
  },
  {
    title: "期中停修",
    dateTime: [
      {
        date: "4/6",
      },
      {
        date: "5/15",
      },
    ],
    color: "#FF5733",
    step: [
      {
        title: "期中停修",
        description:
          "4/6 - 5/15\n停修期間，學生可於系統辦理停修\n（密集課程辦理時間為第一次課程結束後第一個工作日起至課程結束前最後一個工作日止）",
      },
    ],
    info: "期中停修",
    infoUrl:
      "https://www.aa.ntnu.edu.tw/zh_tw/selectives/Dayschool/mid_suspension",
  },
];
</script>
