import json
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

# 配置ChromeDriver
chrome_options = Options()
chrome_options.add_argument("--proxy-server=http://127.0.0.1:8080")

# 打开浏览器
driver = webdriver.Chrome(options=chrome_options)

driver.get("https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/index.jsp")

time.sleep(5)

driver.find_element(By.ID, "treeview-1012-record-C1").click()

driver.find_element(By.ID, "tab-1019-btnInnerEl").click()

driver.switch_to.default_content()
iframe = driver.find_element(By.ID, "C1").find_element(By.ID, "C1_iframe")
driver.switch_to.frame(iframe)

driver.find_element(By.ID, "ext-gen1162").click()

inquire = driver.find_element(By.ID, "tab-1051-btnEl")
details = driver.find_element(By.ID, "tab-1052-btnEl")

data = []

for i in range(1, len(driver.find_elements(By.XPATH, '//*[@id="boundlist-1059-listEl"]/ul/li'))+1):
    inquire.click()

    # select the department
    driver.find_element(By.ID, "ext-gen1162").click()
    department = driver.find_element(
        By.XPATH, f'//*[@id="boundlist-1059-listEl"]/ul/li[{i}]')
    department_text = department.text
    department.click()

    # click the search button
    driver.find_element(By.ID, "button-1012-btnInnerEl").click()

    # wait for the page to load
    # time.sleep(5)
    # while True:
    #     try:
    #         if len(driver.find_element(By.ID, "gridview-1032-body").find_elements(By.TAG_NAME, "tr")) > 0:
    #             break
    #     except:
    #         pass

    # last_height = driver.execute_script("return document.body.scrollHeight")
    # while True:
    #     # 向下滚动
    #     driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    #     # 等待页面加载
    #     driver.implicitly_wait(1)
    #     # 计算新的滚动高度并与最后的滚动高度进行比较
    #     new_height = driver.execute_script("return document.body.scrollHeight")
    #     if new_height == last_height:
    #         break
    #     last_height = new_height

    # count = 0
    # title = [cell.text for cell in driver.find_element(
    #     By.ID, "headercontainer-1014-targetEl").find_elements(By.TAG_NAME, "span")]
    # try:
    #     table = driver.find_element(By.ID, "gridview-1032-body").find_elements(By.TAG_NAME, "tr")
    #     for row in table:
    #         try:
    #             data.append({title[t]: cell.find_element(
    #                 By.TAG_NAME, "div").text for t, cell in enumerate(row.find_elements(By.TAG_NAME, "td"))})
    #             count += 1
    #         except:
    #             pass
    # except:
    #     pass

    # try:
    #     print(f"{department_text}: {count} / {len(table)}")
    # except:
    #     print(f"{department_text}: Error")

    details.click()
    
    time.sleep(0.5)

driver.switch_to.default_content()

time.sleep(10)

driver.quit()