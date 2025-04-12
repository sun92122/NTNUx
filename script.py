import json


from mitmproxy import http

# init file
with open("response_content.json", "w", encoding="utf-8") as f:
    f.write("[]")


def response(flow: http.HTTPFlow) -> None:
    # check if the request URL is the target URL
    if flow.request.pretty_url.startswith(
            "https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/CofopdlCtrl?_dc="):
        # get response content
        response_content = flow.response.get_text()

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

        print("Response content saved to response_content.txt")
