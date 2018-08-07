from sanic import Sanic
from sanic import response

from sanic_cors import CORS

app = Sanic()
CORS(app)

tasks = []

@app.route('/task', methods=["POST", "OPTIONS"])
async def save_task(request):
    if request.method == "POST":
        task = request.json.get('task')
        tasks.append(task)
        return response.json({"status": "saved"})
    else:
        return response.json({})

@app.route('/task/<_id>', methods=["DELETE", "OPTIONS"])
async def delete_task(request, _id):
    if request.method == "DELETE":
        if _id >= len(tasks) or _id < 0:
            return response.json({"status": "not found"})
        try:
            del tasks[int(_id)]
        except ValueError:
            return response.json({"status": "id is not valid"})
        return response.json({"status": "deleted", "id": _id})
    else:
        return response.json({})

@app.route('/tasks', methods=["GET", "OPTIONS"])
async def get_tasks(request):
    if request.method == "GET":
        return response.json({"tasks": tasks})
    else:
        return response.json({})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
