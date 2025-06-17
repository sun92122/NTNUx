<!-- <script>
const course = {
  acadm_year: "113",
  acadm_term: "2",
  authorize_p: "5",
  authorize_using: "0",
  chn_name: "壓力紓解與管理 </br>[ 學分學程：金牌書院 ]",
  classes: "",
  comment: "",
  counter: "13",
  counter_exceptAuth: "13",
  course_avg: "",
  course_code: "A0U0006",
  course_group: "",
  course_kind: "半",
  credit: 2,
  dept_chiabbr: "運休學院",
  dept_code: "A",
  dept_group_name: "",
  eng_name:
    "Stress Management </br>[ Program: The Program of Elite Athletes College ]",
  eng_teach: "",
  form_s: "",
  limit: "5",
  limit_count_h: "50",
  option_code: "選",
  restrict: "◎初選 金牌書院學程 研究生得下修",
  rt: "N",
  serial_no: "0001",
  teacher: "季力康",
  time_inf: "四 3-4 和平 樸402",
  time_loc: { "四 3-4": "和平 樸402" },
  generalCore: "",
  course_name: "壓力紓解與管理 ",
  time: "四 3-4",
  location: "和平 樸402",
  timeLocList: [
    { day: "四", period: "3", loc: "和平 樸402" },
    { day: "四", period: "4", loc: "和平 樸402" },
  ],
  timeListStr: "四3/四4",
  description: {
    description:
      "<p>This course is mainly to introduce the source of stress, the theory of stress and the methods of stress relief and management, and transform it into theory and method to practically use competitive sports and life posture.</p>",
    brief:
      "本課程主要是介紹壓力的來源、壓力的理論以及壓力紓解與管理的方法，並將理論與方法實際應用於競技運動與生活層面。",
  },
};
</script> -->
<template>
  <div class="course-details" v-if="course.course_name">
    <h1>{{ course.course_name }}</h1>
    <p>{{ course.acadm_year }}-{{ course.acadm_term }} 開課</p>
    <Card class="course-card">
      <template #content>
        <div class="course-info-first">
          <div
            class="course-info-item"
            v-for="item in showInfo"
            :key="item.label"
          >
            <i :class="item.icon" style="font-size: 1.2rem"></i>
            <div style="flex: 1; display: flex; flex-direction: column">
              <span style="color: var(--p-surface-500); font-size: 12px">{{
                item.label
              }}</span>
              <span style="font-size: 1.25rem">{{
                course[item.value] || ""
              }}</span>
            </div>
          </div>
        </div>
        <div class="course-info-second">
          <Accordion>
            <AccordionPanel>
              <AccordionHeader> 備註 </AccordionHeader>
              <AccordionContent>
                <div v-if="course.comment" class="course-info-item">
                  <i class="pi pi-comment" style="font-size: 1.2rem"></i>
                  <span>{{ course.comment }}</span>
                </div>
                <div v-if="course.restrict" class="course-info-item">
                  <i
                    class="pi pi-exclamation-triangle"
                    style="font-size: 1.2rem"
                  ></i>
                  <span>{{ course.restrict }}</span>
                </div>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionHeader> 選課資訊 </AccordionHeader>
              <AccordionContent> </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionHeader> 課程簡介 </AccordionHeader>
              <AccordionContent>
                <div v-if="course.description" class="course-info-item">
                  <i class="pi pi-info-circle" style="font-size: 1.2rem"></i>
                  <span
                    v-html="
                      course.description.brief || course.description.description
                    "
                  ></span>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </template>
    </Card>
    <iframe
      :src="
        'https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?' +
        `year=${course.acadm_year}&term=${course.acadm_term}&courseCode=${course.course_code}&courseGroup=${course.course_group}&deptCode=${course.dept_code}&formS=${course.form_s}&classes1=${course.classes}&deptGroup=${course.dept_group_name}`
      "
      width="100%"
      height="600px"
      frameborder="0"
      style="margin-top: 20px; background: #fff"
    ></iframe>
  </div>
  <div v-else>
    <p>Loading course details...</p>
  </div>
</template>

<script setup>
import {
  Button,
  Card,
  Accordion,
  AccordionPanel,
  AccordionHeader,
  AccordionContent,
} from "primevue";

import { useCourses } from "~/composables/useCourses";

const route = useRoute();

const {
  terms,
  currentTerm,
  rowData,
  loading,
  reloadCurrentTerm,
  defaultGlobalFilterFields,
  initTermData,
  courseFormatter,
} = useCourses();

const course = ref({
  year: route.query.year,
  term: route.query.term,
  serial_no: route.query.id,
});

const showInfo = ref([
  {
    label: "開課序號",
    icon: "pi pi-hashtag",
    value: "serial_no",
  },
  {
    label: "科目代碼",
    icon: "pi pi-code",
    value: "course_code",
  },
  {
    label: "開課單位",
    icon: "pi pi-building",
    value: "dept_chiabbr",
  },
  {
    label: "學分",
    icon: "pi pi-book",
    value: "credit",
  },
  {
    label: "授課教師",
    icon: "pi pi-user",
    value: "teacher",
  },
  {
    label: "上課時間",
    icon: "pi pi-clock",
    value: "time",
  },
  {
    label: "上課地點",
    icon: "pi pi-map-marker",
    value: "location",
  },
]);

if (course.value.year && course.value.term && course.value.serial_no) {
  getCourseData();
} else {
  // Handle the case where parameters are not provided
  console.error("Missing course parameters", {
    year: course.value.year,
    term: course.value.term,
    serial_no: course.value.serial_no,
  });
}

async function getCourseData() {
  const rowDatas = useState("rowDatas", () => ({}));

  const acadm = `${course.value.year}-${course.value.term}`;

  if (rowDatas.value[acadm]) {
    for (const rowData of rowDatas.value[acadm]) {
      if (rowData.serial_no === course.value.serial_no) {
        course.value = {
          ...rowData,
          description: await getDescription(rowData.course_code),
        };
        return;
      }
    }
  }
  // If the course data is not found in the state, fetch it from the API
  fetch(
    `data/${acadm}/${Math.floor(course.value.serial_no / 1000) + 1}.min.json`
  )
    .then((response) => response.json())
    .then(async (data) => {
      for (const rowData of data) {
        if (rowData.serial_no === course.value.serial_no) {
          course.value = {
            ...courseFormatter(rowData),
            description: await getDescription(rowData.course_code),
          };
          return;
        }
      }
      console.error("Course not found in fetched data");
    })
    .catch((error) => {
      console.error("Error fetching course data:", error);
    });
}

async function getDescription(course_code) {
  // https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/CourseDescCtrl?action=getCoursedesc_field&course_code=C0C8001
  // Use a free CORS proxy for development only; remove or replace for production
  // const proxyUrl = "https://corsproxy.io/?" +
  // "url=https%3A%2F%2Fcourseap2.itc.ntnu.edu.tw%2FacadmOpenCourse%2FCourseDescCtrl%3Faction%3DgetCoursedesc_field%26course_code%3D";
  const proxyUrl = "https://cors.ntnux.org/?course_code=";

  return await fetch(proxyUrl + course_code)
    .then(async (response) => {
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        return {
          description: data.data[0].CourseDescription || "",
          brief: data.data[0].brief || "",
        };
      } else {
        console.error("Description not found in response", data);
        return "No description available.";
      }
    })
    .catch((error) => {
      console.error("Error fetching course description:", error);
      return "Error fetching description.";
    });
}

onMounted(async () => {
  const updateMenubar = useState("updateMenubar");

  await initTermData(route);

  updateMenubar.value();
});
</script>

<style scoped lang="scss">
.course-details {
  padding: 20px;
  overflow: auto;
}

.course-info-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  align-items: center;
  gap: 1rem;
}

@media screen and (max-width: 600px) {
  .course-details {
    padding: 0 10px;
  }

  .p-accordionheader,
  .p-accordioncontent-content {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

<style lang="scss">
@media screen and (min-width: 760px) {
  .p-card-content {
    display: grid;
    grid-template-columns: 20rem auto;
    gap: 1rem;
  }
}
</style>
