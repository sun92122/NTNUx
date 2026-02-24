// cross to https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/CourseDescCtrl?action=getCoursedesc_field&course_code=${encodeURIComponent(courseCode)}
// and return the result as json
// parmas: course code

import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const params = event.context.params || {};
  const course_code = params.course_code || params["course_code"];

  if (!course_code || typeof course_code !== "string") {
    return {
      error: "course_code is required and must be a string",
    };
  }
  const response = await fetch(
    `https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/CourseDescCtrl?action=getCoursedesc_field&course_code=${encodeURIComponent(
      course_code,
    )}`,
  );
  if (!response.ok) {
    return {
      error: "Failed to fetch course description",
    };
  }
  return JSON.stringify(await response.json());
});
