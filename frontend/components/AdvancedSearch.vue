<template>
  <div class="advanced-search-box">
    <p>上課時間</p>
    <TimeSelectionTable />
    <p>上課地點</p>
    <div class="advanced-search-options">
      <Button
        v-for="location in ['和平', '公館', '其他']"
        :key="location"
        severity="secondary"
        variant="outlined"
        :label="location"
        @click="() => $emit('update:location', location)"
      ></Button>
    </div>
    <p>上課形式</p>
    <div class="advanced-search-options">
      <Button
        v-for="type in ['英文授課', '遠距課程', '密集課程']"
        :key="type"
        severity="secondary"
        variant="outlined"
        :label="type"
        @click="() => $emit('update:courseType', type)"
      ></Button>
    </div>
    <p>通識領域</p>
    <div class="advanced-search-options">
      <Button
        v-for="area in ['人文藝術', '社會科學', '自然科學', '邏輯運算']"
        :key="area"
        severity="secondary"
        variant="outlined"
        :label="area"
        @click="() => $emit('update:generalEducationArea', area)"
      ></Button>
    </div>
    <div class="advanced-search-options">
      <Button
        v-for="area in ['學院共同課程', '跨域專業探索課程', '大學入門']"
        :key="area"
        severity="secondary"
        variant="outlined"
        :label="area"
        @click="() => $emit('update:generalEducationArea', area)"
      ></Button>
    </div>
    <p>學分數</p>
    <div class="advanced-search-options">
      <Button
        v-for="credit in [1, 2, 3, 4, '>= 5']"
        :key="credit"
        severity="secondary"
        variant="outlined"
        :label="credit"
        @click="() => $emit('update:credits', credit)"
      ></Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { Button } from "primevue";

import { TimeSelectionTable } from "#components";
</script>

<style scoped lang="scss">
.advanced-search-box {
  padding: 0 1rem 1rem 1rem;
  border-radius: 8px;
}

.advanced-search-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
