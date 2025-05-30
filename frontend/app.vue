<template>
  <div id="app">
    <Toast />
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
          >
            <template #handle>
              <i
                :class="{ 'pi pi-sun': !darkMode, 'pi pi-moon': darkMode }"
              ></i>
            </template>
          </ToggleSwitch>
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

    <Dialog
      v-model:visible="isShowSchedule"
      maximizable
      modal
      header="課表"
      :style="{
        width: '850px',
        height: '80vh',
      }"
      :content-style="{
        margin: '0 0 1rem',
      }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <FloatingSchedule />
    </Dialog>
  </div>
</template>

<script setup>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import ToggleSwitch from "primevue/toggleswitch";

import Toast from "primevue/toast";

import Dialog from "primevue/dialog";
import { FloatingSchedule } from "#components";

const updateMenubar = useState("updateMenubar");
onMounted(() => {
  updateMenubar.value = updateMenubarItems;
});

const isShowSchedule = ref(false); // 控制課表顯示的變數

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

function updateMenubarItems() {
  const termLabelItem = items.value[1];

  // 更新學期選單
  termLabelItem.items = terms.value.map((term) => ({
    label: term,
    items: [1, 2, 3].map((subTerm) => ({
      label: ["1", "2", "暑期"][subTerm - 1],
      command: () => {
        currentTerm.value = `${term}-${subTerm}`;
        loadTermData.value();
        termLabelItem.label = `學期：${term}-${["1", "2", "暑期"][subTerm - 1]}`; // 更新學期顯示
      },
    })),
  }));
  // 更新學期顯示
  if (!currentTerm.value) {
    termLabelItem.label = "選擇學期";
    return;
  }
  termLabelItem.label = `學期：${currentTerm.value}`;
}
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC:wght@300;400;700&display=swap");

#app {
  font-family: "LXGW WenKai Mono TC", monospace;

  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
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

@media screen and (max-width: 375px) {
  :root {
    --p-navigation-item-padding: 0.5rem 0.25rem;
    --p-menubar-gap: 0rem;
  }
}
</style>
