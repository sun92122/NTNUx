import json


from mitmproxy import http

# init file
with open("response_content.json", "w", encoding="utf-8") as f:
    f.write("[]")


def response(flow: http.HTTPFlow) -> None:
    # 检查请求URL是否为目标URL
    if flow.request.pretty_url.startswith(
        "https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/CofopdlCtrl?_dc="):
        # 获取响应内容
        response_content = flow.response.get_text()

        # 保存响应内容到文件
        # read json, append new data, write back to file
        try:
            with open("response_content.json", "r+", encoding="utf-8") as f:
                data = json.load(f)
                data.append(json.loads(response_content))
                f.seek(0)
                f.write(json.dumps(data, ensure_ascii=False, indent=4))
                f.truncate()
        except:
            with open("response_content.json", "w", encoding="utf-8") as f:
                data = []
                data.append(json.loads(response_content))
                f.write(json.dumps(data, ensure_ascii=False, indent=4))

        # 打印保存成功信息
        print("Response content saved to response_content.txt")
