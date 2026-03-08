import { compressToBase64, decompressFromBase64 } from "lz-string";
import { JSONC } from "jsonc.min";

export function jsonLzEncode(obj: any) {
  try {
    // return compressToBase64(JSONC.minify(obj));
    if (typeof obj === "string") {
      return compressToBase64(obj);
    } else {
      const jsonString = JSONC.minify(JSONC.stringify(obj));
      return compressToBase64(jsonString);
    }
  } catch (e) {
    console.error("Failed to compress JSON:", e);
    return "";
  }
}

export function jsonLzDecode(str: string) {
  try {
    return JSONC.parse(decompressFromBase64(str));
  } catch (e) {
    console.error("Failed to decompress JSON:", e);
    return null;
  }
}

function customToast(
  id: string,
  title: string,
  icon: string = "tabler:copy",
  description?: string,
) {
  useToast().add({
    id: id,
    title: title,
    description: description,
    icon: icon,
    progress: false,
    type: "foreground",
  });
}

export function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text);
  customToast(
    `copy-${label}`,
    `已複製${label}（${text.length > 10 ? text.slice(0, 10) + "..." : text}）`,
    "tabler:copy",
  );
}

export function addToTimetableToast(courseName: string, courseId: string) {
  customToast(
    `add-${courseName}`,
    `已加入課表：${courseName}（${courseId}）`,
    "tabler:check",
  );
}
export function removeFromTimetableToast(courseName: string, courseId: string) {
  customToast(
    `remove-${courseName}`,
    `已從課表移除：${courseName}（${courseId}）`,
    "tabler:x",
  );
}
