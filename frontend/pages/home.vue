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

  <div class="container">"主頁測試"</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useCourses } from "~/composables/useCourses";

import { Tabs, Tab, TabList } from "primevue";

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

onMounted(async () => {
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
  width: clamp(0px, 100%, 670px);

  @media screen and (min-width: 600px) {
    .p-tablist-tab-list {
      justify-content: center;
    }
  }
}
</style>
