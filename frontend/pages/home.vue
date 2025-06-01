<template>
  <div class="tabs-container">
    <Tabs scrollable>
      <TabList>
        <Tab
          v-for="tab in Object.values(searchModeList)"
          :key="tab.value"
          :value="tab.value"
          @click="tab.command ? tab.command() : null"
        >
          <RouterLink
            v-if="tab.route"
            :to="tab.route"
            :style="{ textDecoration: 'none', color: 'inherit' }"
          >
            {{ tab.label }}
          </RouterLink>
        </Tab>
      </TabList>
    </Tabs>
  </div>

  <!-- 選課時程 -->
  <div class="container">
    <h3 :style="{ marginBottom: 0 }">
      {{ selectionSchedule?.year }} 學年度 第 {{ selectionSchedule?.term }} 學期
    </h3>
    <h1 class="center">選課時程</h1>
    <Carousel
      :value="selectionSchedule?.schedule"
      :numVisible="3"
      :numScroll="1"
      :showNavigators="false"
      :showIndicators="true"
      :responsiveOptions="responsiveOptions"
      ref="carousel"
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
              <span :style="{ fontSize: 'x-large', color: data.color }">
                {{ data.date.date }}
              </span>
            </div>
            <div v-if="data.start">
              <div style="text-align: center">
                <span v-if="data.start.time"> {{ data.start.time }} </span>
                <span :style="{ fontSize: 'x-large', color: data.color }">
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
        icon="pi pi-chevron-left"
        class="p-button-rounded p-button-secondary p-mr-2"
      ></Button>
      <Button
        icon="pi pi-chevron-right"
        class="p-button-rounded p-button-secondary"
      ></Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useCourses } from "~/composables/useCourses";

import { Tabs, Tab, TabList, Avatar, Card, Timeline, Carousel } from "primevue";

const route = useRoute();

const {
  terms,
  currentTerm,
  rowData,
  loading,
  reloadCurrentTerm,
  initTermData,
  defultGlobalFilterFields,
} = useCourses();

const updateMenubar = useState("updateMenubar");

// 搜尋模式與子篩選器
const searchModeList = ref({
  quick: {
    label: "快速搜尋",
    value: "quick",
    route: "/",
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

const carousel = ref(null);
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

onMounted(async () => {
  await fetch("/data/schedule.json")
    .then((response) => response.json())
    .then((data) => {
      selectionSchedule.value = data;
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

.tabs-container {
  margin: 0.5rem auto 1rem;
  width: clamp(0px, 100%, 760px);

  @media screen and (min-width: 760px) {
    .p-tablist-tab-list {
      justify-content: center;
    }
  }
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
</style>
