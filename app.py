import json
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

# setting up ChromeDriver
chrome_options = Options()
chrome_options.add_argument("--proxy-server=http://127.0.0.1:8080")

# open the browser
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

    details.click()

    time.sleep(1)

driver.switch_to.default_content()

time.sleep(15)

driver.quit()
