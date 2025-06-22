<template>
  <!-- 選課時程 -->
  <div class="container">
    <CourseSearchBar />
    <ProgressSpinner
      v-if="routerLoading"
      style="margin-top: 30vh; margin-bottom: 20vh"
    />
    <div v-else class="container">
      <h3 :style="{ marginBottom: 0 }">
        {{ selectionSchedule?.year }} 學年度 第
        {{ selectionSchedule?.term }} 學期
      </h3>
      <h1 class="center">選課時程</h1>
      <Carousel
        :value="selectionSchedule?.schedule"
        :page="carouselPage"
        :numVisible="3"
        :numScroll="1"
        :showNavigators="false"
        :showIndicators="false"
        :responsiveOptions="responsiveOptions"
      >
        <template #item="{ data, _ }">
          <Card class="p-mb-3" :style="data?.info ? {} : { boxShadow: 'none' }">
            <template #title>
              <h3 style="margin: 0">{{ data?.info }}</h3>
            </template>
            <template #subtitle>
              <div v-if="data?.date" style="text-align: center">
                <span v-if="data.date.time">
                  {{ data.date.time }}
                </span>
                <span class="card-title-date" :style="{ color: data.color }">
                  {{ data.date.date }}
                </span>
              </div>
              <div v-if="data.start">
                <div style="text-align: center">
                  <span v-if="data.start.time"> {{ data.start.time }} </span>
                  <span class="card-title-date" :style="{ color: data.color }">
                    {{ data.start.date }}-{{ data.end.date }}
                  </span>
                  <span v-if="data.end.time"> {{ data.end.time }}</span>
                </div>
              </div>
            </template>
            <template #content>
              <Timeline :value="data?.steps" :align="'left'" class="p-mt-3">
                <template #content="{ item }">
                  <div class="p-d-flex p-ai-center">
                    <div>
                      <h4 style="margin: 0">{{ item.title }}</h4>
                      <div
                        :style="{
                          whiteSpace: 'break-spaces',
                          marginTop: '0.5rem',
                        }"
                        class="p-card-subtitle"
                      >
                        {{ item.description }}
                      </div>
                    </div>
                  </div>
                </template>
              </Timeline>
            </template>
            <template #footer>
              <div v-if="data?.moreInfo" style="margin-top: 8rem">
                <a
                  :href="data.moreInfoUrl"
                  target="_blank"
                  style="color: inherit; text-decoration: none; cursor: pointer"
                >
                  <i class="pi pi-external-link" style="margin-right: 1rem"></i>
                  {{ data.moreInfo }}
                </a>
              </div>
            </template>
          </Card>
        </template>
      </Carousel>
      <div>
        <!-- carousel navigation buttons -->
        <Button
          icon="pi pi-angle-left"
          variant="text"
          rounded
          size="large"
          @click="scrollToPage(carouselPage - 1)"
          :disabled="carouselPage <= 0"
          style="margin-right: 0.5rem"
        ></Button>
        <Button
          icon="pi pi-angle-right"
          variant="text"
          rounded
          size="large"
          @click="scrollToPage(carouselPage + 1)"
          :disabled="carouselPage >= selectionSchedule?.schedule.length - 3"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useCourses } from "~/composables/useCourses";

import {
  Tabs,
  Tab,
  TabList,
  Button,
  Card,
  Timeline,
  Carousel,
  InputText,
  FloatLabel,
  IconField,
  InputIcon,
  ProgressSpinner,
} from "primevue";
import { CourseSearchBar } from "#components";

const route = useRoute();
const router = useRouter();

const {
  terms,
  currentTerm,
  rowData,
  tempDatas,
  loading,
  programSet,
  reloadCurrentTerm,
  defaultGlobalFilterFields,
  initTermData,
  courseFormatter,
} = useCourses();

const updateMenubar = useState("updateMenubar");

const routerLoading = useState("routerLoading", () => false);

// 搜尋模式與子篩選器
const searchModeList = ref({
  quick: {
    label: "快速搜尋",
    value: "quick",
    route: "/",
  },
  dept: {
    label: "系所",
    value: "dept",
    route: "/?m=dept",
  },
  advanced: {
    label: "進階搜尋",
    value: "advanced",
    route: "/?m=advanced",
  },
  general: {
    label: "通識",
    value: "general",
    route: "/?m=general",
  },
  physical: {
    label: "體育",
    activeLabel: "普通體育",
    value: "physical",
    route: "/?m=physical",
  },
  defense: {
    label: "國防",
    activeLabel: "全民國防教育",
    value: "defense",
    route: "/?m=defense",
  },
  interschool: {
    label: "校際",
    activeLabel: "臺大系統校際課程",
    value: "interschool",
    route: "/?m=interschool",
  },
  program: {
    label: "學分學程",
    value: "program",
    route: "/?m=program",
  },
  english: {
    label: "英文三",
    value: "english",
    route: "/?m=english",
  },
  emi: {
    label: "英文授課",
    value: "emi",
    route: "/?m=emi",
  },
  "": {
    label: "",
    value: "quick",
    route: "/",
  },
});

const selectionSchedule = useState("courseSelectionSchedule", () => {});
const carouselPage = ref(1);

const responsiveOptions = ref([
  {
    breakpoint: "1280px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "745px",
    numVisible: 1,
    numScroll: 1,
  },
]);

function findNowSchedule() {
  const now = new Date();
  const year = now.getFullYear() - 1911; // 民國年轉換
  const month = now.getMonth() + 1; // 月份從0開始
  const day = now.getDate();

  for (const [index, schedule] of selectionSchedule.value.schedule.entries()) {
    if (schedule.date && schedule.date.date) {
      const [scheduleYear, scheduleMonth, scheduleDay] = schedule.date.date
        .split("/")
        .map(Number);
      if (
        year > scheduleYear ||
        (year === scheduleYear && month > scheduleMonth) ||
        (year === scheduleYear && month === scheduleMonth && day > scheduleDay)
      ) {
        continue;
      }
      return index;
    } else if (schedule.end && schedule.end.date) {
      const [endYear, endMonth, endDay] = schedule.end.date
        .split("/")
        .map(Number);
      if (
        year > endYear ||
        (year === endYear && month > endMonth) ||
        (year === endYear && month === endMonth && day > endDay)
      ) {
        continue;
      }
      return index;
    }
  }
}

function clip(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function scrollToPage(page) {
  carouselPage.value = clip(
    page,
    0,
    selectionSchedule.value.schedule.length - 3
  );
}

onMounted(async () => {
  await fetch("/data/schedule.json")
    .then((response) => response.json())
    .then((data) => {
      selectionSchedule.value = data;
      const nowIndex = findNowSchedule();
      if (nowIndex !== undefined) {
        carouselPage.value =
          clip(nowIndex, 1, selectionSchedule.value.schedule.length - 1) - 1;
        const nowSchedule = selectionSchedule.value.schedule[nowIndex];
        useSeoMeta({
          title: "選課時程",
          description: `查看選課時程並快速搜尋課程。${
            nowSchedule.info
              ? `${nowSchedule.info} ${
                  nowSchedule?.date?.date || nowSchedule?.start?.date || ""
                }`
              : ""
          }`,
          keywords: "師大課程查詢, 師大課程, 師大選課, NTNU Course Search",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching course selection schedule:", error);
    });
  await initTermData(route);
  updateMenubar.value();
});
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.p-timeline-event-opposite {
  display: none;
}

.p-carousel-viewport {
  width: clamp(0px, 98vw, 1000px);
  margin: auto;
}

.p-carousel-item-list {
  padding: 1rem 0;
  gap: 1%;
}

.p-carousel-item {
  flex-basis: 32.5% !important;
}
@media screen and (max-width: 745px) {
  .p-carousel-item {
    flex-basis: 99% !important;
  }
  .p-carousel-viewport {
    width: clamp(0px, 99vw, 500px);
  }
}

.p-card {
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 95%;
}
</style>

<style lang="scss" scoped>
h3 {
  text-align: center;
}

.card-title-date {
  font-size: x-large;
  font-weight: bolder;
  margin: 0 0.25rem;
}
</style>
