<template>
  <div id="app">
    <Toast />
    <Toast position="bottom-center" group="bottom" />

    <Menubar :model="items" :sticky="true" breakpoint="340px">
      <template #start>
        <Button
          class="p-button-rounded p-button-secondary me-2"
          as="router-link"
          to="/home"
          aria-label="Home"
        >
          <template #icon>
            <img src="/favicon.svg" alt="Home Icon" width="24" height="24" />
          </template>
        </Button>
      </template>

      <template #end>
        <div class="menubar-end">
          <ToggleSwitch
            v-model="darkMode"
            class="me-2"
            @change="toggleDarkMode"
            aria-label="Toggle Dark Mode"
            :dt="toggleSwitchDt"
            v-if="windowWidth > 600"
          >
            <template #handle>
              <i
                :class="{ 'pi pi-sun': !darkMode, 'pi pi-moon': darkMode }"
              ></i>
            </template>
          </ToggleSwitch>
          <Button
            v-else
            :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
            :severity="darkMode ? 'secondary' : 'primary'"
            class="p-button-rounded p-button-secondary me-2"
            @click="
              () => {
                darkMode = !darkMode;
                toggleDarkMode();
              }
            "
            aria-label="Toggle Dark Mode"
          ></Button>
          <Button
            icon="pi pi-github"
            class="p-button-rounded p-button-secondary"
            as="a"
            href="https://github.com/sun92122/NTNUx"
            target="_blank"
            aria-label="Github"
          ></Button>
        </div>
      </template>
    </Menubar>

    <NuxtPage />

    <!-- Schedule -->
    <Dialog
      v-model:visible="isShowSchedule"
      maximizable
      modal
      header="課表"
      class="floating-schedule-dialog"
      :content-style="{
        margin: '0 0 1rem',
      }"
    >
      <FloatingSchedule />
    </Dialog>

    <!-- Advanced search -->
    <Dialog
      v-model:visible="isShowAdvancedSearch"
      modal
      header="進階搜尋"
      class="advanced-search-dialog"
      :content-style="{
        margin: '0 0 1rem',
      }"
      content-class="hide-scrollbar"
    >
      <AdvancedSearch />
    </Dialog>

    <!-- footer -->
    <footer class="footer">
      <Divider />
      <div class="footer-content">
        <div
          class="footer-content-col"
          v-for="footerItem in footerItems"
          :key="footerItem.label"
        >
          <h4>{{ footerItem.label }}</h4>
          <div v-for="item in footerItem.items" :key="item.label">
            <Button
              v-if="item.url"
              :label="item.label"
              class="p-button-text p-button-secondary"
              asChild
              style="padding: 2px 0"
            >
              <a
                :href="item.url"
                target="_blank"
                style="text-decoration: none; color: inherit"
                >{{ item.label }}</a
              >
              <i
                class="pi pi-external-link"
                style="font-size: 0.75rem; margin-left: 0.5rem"
              ></i>
            </Button>
            <Button
              v-else
              :label="item.label"
              class="p-button-text p-button-secondary"
              @click="item.command"
              style="padding: 2px 0"
            ></Button>
          </div>
        </div>
      </div>
      <Divider class="footer-content" />
      <span style="font-size: clamp(0.75rem, 1.5vw + 0.25rem, 12px)">
        &copy; 2025
        <a
          href="https://github.com/sun92122/NTNUx"
          target="_blank"
          style="color: var(--p-text-secondary-color)"
        >
          NTNUx.
        </a>
        <br />
        所有課程資料為國立臺灣師範大學所有，僅供學術研究與個人使用
        <br />
        資料非實時更新，請以學校公告為準
      </span>
    </footer>
  </div>
</template>

<script setup>
import {
  Menubar,
  Button,
  ToggleSwitch,
  Toast,
  Dialog,
  Divider,
} from "primevue";

import { FloatingSchedule, AdvancedSearch } from "#components";
import { FilterMatchMode } from "@primevue/core/api";

useHead({
  title: "",
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | NTNUx` : "NTNUx | 課程查詢系統";
  },
  meta: [
    {
      name: "description",
      content: "更適合師大人的課程查詢系統，更快、更強、行動裝置友好。",
    },
  ],
});

const updateMenubar = useState("updateMenubar");
const windowWidth = useState("windowWidth", () => window.innerWidth);

function updateWidth() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  updateMenubar.value = updateMenubarItems;
  window.addEventListener("resize", updateWidth);
});

onBeforeMount(() => {
  window.removeEventListener("resize", updateWidth);
});

const isShowSchedule = useState("isShowSchedule", () => false);
const isShowAdvancedSearch = useState("isShowAdvancedSearch", () => false);

const currentTerm = useState("currentTerm", () => null);
const terms = useState("terms", () => []);
const loadTermData = useState("loadTermData");
const items = ref([
  {
    label: "課表",
    icon: "pi pi-fw pi-calendar",
    command: () => {
      isShowSchedule.value = true;
    },
  },
  {
    label: "選擇學期",
    icon: "pi pi-fw pi-book",
    items: [],
  },
]);

const darkMode = useState("darkMode", () => false);
const toggleDarkMode = () => {
  if (darkMode.value) {
    document.documentElement.classList.add("dark-mode-toggle");
  } else {
    document.documentElement.classList.remove("dark-mode-toggle");
  }
};

const toggleSwitchDt = ref({
  width: "3.5rem",
  height: "2rem",
  handle: {
    size: "1.5rem",
    checked: {
      color: "#FFFFFF",
      background: "#000000",
      hover: {
        color: "#FFFFFF",
        background: "#000000",
      },
    },
  },
  checked: {
    background: "#FFFFFF",
    hover: {
      background: "#FFFFFF",
    },
  },
});

const selectedCourses = useState("selectedCourses", () => ({}));
const selectedRows = useState("selectedRows", () => ({}));

const deptLists = useState("deptLists", () => ({}));
const deptList = useState("deptList");

function updateMenubarItems() {
  const termLabelItem = items.value[1];

  if (!deptList.value) {
    deptList.value = getDeptList(useState("rowData").value);
    deptLists.value[currentTerm.value] = deptList.value;
  }

  // 更新學期選單
  termLabelItem.items = terms.value.map((term) => ({
    label: term,
    items: [1, 2, 3].map((subTerm) => ({
      label: ["1", "2", "暑期"][subTerm - 1],
      command: () => {
        currentTerm.value = `${term}-${subTerm}`;
        selectedRows.value = selectedCourses.value[currentTerm.value] || {};
        selectedCourses.value[currentTerm.value] = selectedRows.value;
        deptList.value =
          deptLists.value[currentTerm.value] ||
          getDeptList(useState("rowData").value);
        deptLists.value[currentTerm.value] = deptList.value;
        loadTermData.value();
        termLabelItem.label =
          windowWidth.value > 380
            ? `學期：${term}-${["1", "2", "暑期"][subTerm - 1]}`
            : `${term}-${["1", "2", "暑期"][subTerm - 1]}`;
      },
    })),
  }));
  // 更新學期顯示
  if (!currentTerm.value) {
    termLabelItem.label = "選擇學期";
    return;
  }
  termLabelItem.label =
    windowWidth.value > 380 ? `學期：${currentTerm.value}` : currentTerm.value;
}

const collegeMap = {
  "": "其他",
  E: "教育學院",
  L: "文學院",
  S: "理學院",
  T: "藝術學院",
  H: "科技學院",
  A: "運休學院",
  I: "國社學院",
  M: "音樂學院",
  O: "管理學院",
  C: "產創學院",
  Z: "學程",
};

function getDeptList(data) {
  const deptSet = {};
  data.forEach((course) => {
    const deptCode = course.dept_code;
    const deptChiaAbbr = `${deptCode} ${course.dept_chiabbr}`;

    // 非英文開頭或長度不是1或4碼，歸類為 other
    if (
      !/^[A-Za-z]/.test(deptCode) ||
      (deptCode.length !== 1 && deptCode.length !== 4)
    ) {
      if (!deptSet[""]) {
        deptSet[""] = {};
      }
      deptSet[""][deptCode] = deptChiaAbbr;
      return;
    }

    if (!deptSet[deptCode[0]]) {
      deptSet[deptCode[0]] = {};
    }

    if (deptCode.length === 1) {
      // 學院
      deptSet[deptCode[0]][deptCode] = deptChiaAbbr;
    } else {
      // 系所
      const subDeptCode = deptCode.slice(2);
      if (!deptSet[deptCode[0]][subDeptCode]) {
        deptSet[deptCode[0]][subDeptCode] = {};
      }
      deptSet[deptCode[0]][subDeptCode][deptCode] = deptChiaAbbr;
    }
  });

  return Object.entries(collegeMap).map(([collegeID, collegeName], id) => ({
    key: id,
    label: collegeName,
    data: {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },
    children: Object.entries(deptSet[collegeID] || {}).map(
      ([deptCode, deptName], subId) =>
        typeof deptName === "string"
          ? {
              key: `${id}-${subId}`,
              label: deptName,
              data: {
                value: deptCode,
                matchMode: FilterMatchMode.EQUALS,
              },
            }
          : Object.keys(deptName).length === 1
          ? {
              key: `${id}-${subId}`,
              label: deptName[Object.keys(deptName)[0]],
              data: {
                value: Object.keys(deptName)[0],
                matchMode: FilterMatchMode.EQUALS,
              },
            }
          : {
              key: `${id}-${subId}`,
              label: `${deptCode.slice(0)} ${deptName[
                Object.keys(deptName)[0]
              ].slice(5, deptName[Object.keys(deptName)[0]].indexOf("（"))}`,
              data: {
                value: deptCode.slice(0),
                matchMode: FilterMatchMode.ENDS_WITH,
              },
              children: Object.entries(deptName).map(
                ([subDeptCode, subDeptName], subSubId) => ({
                  key: `${id}-${subId}-${subSubId}`,
                  label: subDeptName,
                  data: {
                    value: subDeptCode,
                    matchMode: FilterMatchMode.EQUALS,
                  },
                })
              ),
            }
    ),
  }));
}

const footerItems = [
  {
    label: "更多功能",
    icon: "pi pi-fw pi-cog",
    items: [
      {
        label: "顯示課表",
        command: () => {
          isShowSchedule.value = true;
        },
      },
      {
        label: "進階搜尋",
        command: () => {
          useRouter().push("/?m=advanced");
        },
      },
      {
        label: "顯示收藏課程",
        command: () => {
          // TODO: Implement favorite courses feature
          // useRouter().push("/favorite");
        },
      },
      {
        label: "課程討論區（GitHub）",
        url: "https://github.com/sun92122/NTNUx/discussions/categories/course-%E8%AA%B2%E7%A8%8B",
      },
    ],
  },
  {
    label: "關於 NTNUx",
    icon: "pi pi-fw pi-info-circle",
    items: [
      {
        label: "GitHub",
        url: "https://github.com/sun92122/NTNUx",
      },
      {
        label: "Bug 回報",
        url: "https://github.com/sun92122/NTNUx/issues",
      },
      {
        label: "NTNUx 討論區",
        url: "https://github.com/sun92122/NTNUx/discussions",
      },
    ],
  },
  {
    label: "實用連結",
    icon: "pi pi-fw pi-link",
    items: [
      {
        label: "師大課程資訊",
        url: "https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/index.jsp",
      },
      {
        label: "師大選課系統",
        // randomly 1-4
        url: `https://cos${
          Math.floor(Math.random() * 4) + 1
        }s.ntnu.edu.tw/AasEnrollStudent`,
      },
      {
        label: "行政資訊入口",
        url: "https://iportal2.ntnu.edu.tw/ntnu/",
      },
      {
        label: "年度行事曆",
        url: "https://www.aa.ntnu.edu.tw/zh_tw/Calender",
      },
      {
        label: "選課沒地雷（FB）",
        url: "https://www.facebook.com/groups/143704482352660/",
      },
    ],
  },
];
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC:wght@400;700&display=swap");

#app {
  font-family: "LXGW WenKai Mono TC", monospace;

  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}

footer {
  font-family: sans-serif;
  text-align: center;
  padding: 1rem 0;
  background-color: var(--p-content-background);
  color: var(--p-text-secondary-color);
  width: 100%;
  margin-top: auto;
}

// 3 columns footer layout
.footer-content {
  width: clamp(40rem, 80vw, 60rem);
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 2rem;
}

.footer-content-col {
  flex: 1;
  min-width: 10rem;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h4 {
    margin: 0.5rem 0;
    font-size: clamp(1rem, 1.5vw + 0.25rem, 1.1rem);
    color: var(--p-text-secondary-color);
  }

  div {
    color: var(--p-surface-500);
  }
}

// 1 column footer layout for small screens
@media screen and (max-width: 600px) {
  .footer-content {
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0;
  }

  .footer-content-col {
    width: 100%;
    max-width: none;
    text-align: center;
    padding: 0.5rem 0;
  }
}

.menubar-end {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>

<style lang="scss">
body {
  margin: 0;
  background-color: var(--p-content-background);
}

html {
  font-size: 14px;
}

.p-menubar-submenu {
  z-index: 1000 !important;
  min-width: 10rem;
}

.p-button-icon-only {
  text-decoration: none;
}

@media screen and (max-width: 400px) {
  .p-menubar-submenu {
    min-width: 8rem;
  }
}

.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer and Edge */
}

.advanced-search-dialog,
.floating-schedule-dialog {
  width: clamp(44rem, 85vw, 56rem);
  height: 90vh;
}

@media screen and (max-width: 770px) {
  .advanced-search-dialog,
  .floating-schedule-dialog {
    width: 90vw;
    height: 95vh;
  }
}
</style>
