from sanic import Sanic
from sanic import response

from sanic_cors import CORS

app = Sanic()
CORS(app)

tasks = []

@app.route('/task', methods=["POST", "OPTIONS"])
async def save_task(request):
    if request.method == "OPTIONS":
        return response.json({})

    task = request.json.get('task')
    if not task:
        return response.json(
            {"status": "Task not found! please send me a task!"},
            status=400
        )

    tasks.append([task,False])
    return response.json({"status": "saved"})

@app.route('/task/<_id>', methods=["DELETE", "OPTIONS"])
async def delete_task(request, _id):
    if request.method == "OPTIONS":
        return response.json({})

    try:
        del tasks[int(_id)]
    except ValueError:
        return response.json(
            {"status": "The id param is not int parseable"},
            status=400
        )
    except IndexError:
        return response.json(
            {"status": "Index out of bounds"},
            status=400
        )

    return response.json({"status": "deleted", "id": _id})

@app.route('/tasks', methods=["GET", "OPTIONS"])
async def get_tasks(request):
    if request.method == "OPTIONS":
        return response.json({})

    return response.json({"tasks": tasks})

@app.route('/realized/<_id>', methods=["POST", "OPTIONS"])
async def mark_as_done(request, _id):
    if request.method == "OPTIONS":
        return response.json({})

    try:
        id_index = int(_id)
        if tasks[id_index][1]:
            tasks[id_index][1]=False
        else:
            tasks[id_index][1]=True
    except ValueError:
        return response.json(
            {"status": "The id param is not int parseable"},
            status=400
        )
    except IndexError:
        return response.json(
            {"status": "Index out of bounds"},
            status=400
        )

    return response.json({"status": "realized", "id": _id})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
