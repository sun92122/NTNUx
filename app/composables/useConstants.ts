export const modeList = [
  // default
  "quick",
  // with dropdown filters
  "dept",
  "general",
  "program",
  // only advanced filters
  "pe",
  "nd",
  "interschool",
  "english3",
  "emi",
] as const;

export const optionMap = {
  必: "必修",
  選: "選修",
  通: "通識",
} as const;

export const generalCoreMap = {
  A1: "人文藝術",
  A2: "社會科學",
  A3: "自然科學",
  A4: "邏輯運算",
  B1: "學院共同課程",
  B2: "跨域專業探索課程",
  B3: "大學入門",
  C1: "專題探究",
  C2: "MOOCs",
} as const;

export const locationMap: Record<string, string> = {
  "和平 體": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 大韻律教室": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 小韻律教室": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 金牌講堂": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 武術": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 重量訓練": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 桌球": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 體操": `query=${encodeURIComponent("臺灣師大體育館")}&query_place_id=ChIJYb4lRIWpQjQRL0xeKf3wU5s`,
  "和平 游泳": `query=${encodeURIComponent("師大校本部游泳池")}&query_place_id=ChIJ_RYYFoWpQjQRYXjFRZMdT74`,
  "和平 網球": `query=${encodeURIComponent("25°01'31.4\"N 121°31'29.8\"E")}`,
  "和平 操場": `query=${encodeURIComponent("師大田徑場")}&query_place_id=ChIJk-11piipQjQRIk2J3lFVzL0`,
  "和平 室外籃球": `query=${encodeURIComponent("師大室外籃球場")}&query_place_id=ChIJEU5FKwCpQjQRIGh7s2sNaD8`,

  "和平 教": `query=${encodeURIComponent("國立臺灣師範大學教育學院")}&query_place_id=ChIJOzXfQ4SpQjQRey1cq9keiHg`,
  "和平 綜": `query=${encodeURIComponent("師大綜合大樓")}&query_place_id=ChIJT7-wTYSpQjQR83hmnG7I66M`,
  "和平 美術": `query=${encodeURIComponent("師大美術館")}&query_place_id=ChIJ-242PoSpQjQRr1522e9jGkw`,
  "和平 美": `query=${encodeURIComponent("師大美術系館")}&query_place_id=ChIJU6HXsYWpQjQRsdxZ5f-XHos`,
  "和平 音": `query=${encodeURIComponent("師大音樂系館")}&query_place_id=ChIJpcsjPIWpQjQRP1yFgneOusQ`,
  "和平 特": `query=${encodeURIComponent("25°01'38.7\"N 121°31'43.4\"E")}&query_place_id=ChIJW6a6NYSpQjQRGOjP7FbQEdM`,
  "和平 誠": `query=${encodeURIComponent("25°01'29.7\"N 121°31'40.6\"E")}`,
  "和平 正": `query=${encodeURIComponent("25°01'30.4\"N 121°31'40.4\"E")}`,
  "和平 勤": `query=${encodeURIComponent("25°01'30.1\"N 121°31'36.5\"E")}`,
  "和平 樸": `query=${encodeURIComponent("25°01'30.8\"N 121°31'36.7\"E")}`,
  "和平 視聽教室": `query=${encodeURIComponent("25°01'38.7\"N 121°31'47.5\"E")}&query_place_id=ChIJXQ7ZBwCpQjQR4Y0WNA2RBiw`,

  "公館 中正": `query=${encodeURIComponent("國立臺灣師範大學中正堂")}&query_place_id=ChIJVVUVkfWpQjQR_9XOzks2Va0`,
  "公館 室外籃球": `query=${encodeURIComponent("師大公館籃球場")}&query_place_id=ChIJTTdD0tmpQjQR2SD1EZb2UBQ`,
  "公館 網球": `query=${encodeURIComponent("25°00'32.1\"N 121°32'12.6\"E")}`,
  "公館 Ｓ": `query=${encodeURIComponent("臺灣師範大學公館校區 研究大樓")}&query_place_id=ChIJ0_ApyvWpQjQRb80NTJPyiPY`,
  "公館 Ａ": `query=${encodeURIComponent("25°00'25.9\"N 121°32'04.3\"E")}`,
  "公館 Ｂ": `query=${encodeURIComponent("25°00'25.9\"N 121°32'08.3\"E")}`,
  "公館 Ｃ": `query=${encodeURIComponent("國立臺灣師範大學 理學院-C棟")}&query_place_id=ChIJ2df3ulmpQjQRcCbH2Sj1Yw8`,
  "公館 Ｄ": `query=${encodeURIComponent("國立臺灣師範大學 理學院-D棟")}&query_place_id=ChIJVY7c4PWpQjQR221R0RHEEFI`,
  "公館 Ｅ": `query=${encodeURIComponent("25°00'25.9\"N 121°32'04.3\"E")}`,
  "公館 Ｆ": `query=${encodeURIComponent("25°00'27.0\"N 121°32'04.5\"E")}`,
  "公館 理圖": `query=${encodeURIComponent("臺灣師範大學圖書館-公館分館")}&query_place_id=ChIJi3OrJx6qQjQRoKJGHofymIo`,
  "公館 數學": `query=${encodeURIComponent("25°00'26.9\"N 121°32'10.0\"E")}&query_place_id=ChIJ2cUs7PWpQjQRPDed3BxV8dM`,
  "公館 體育館": `query=${encodeURIComponent("25°00'31.3\"N 121°32'06.8\"E")}`,
  "公館 研": `query=${encodeURIComponent("25°00'31.3\"N 121°32'06.8\"E")}`,
} as const;
