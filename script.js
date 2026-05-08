const canvas =
    document.getElementById("graphCanvas");

const ctx = canvas.getContext("2d");

const nodes = {
    A: { x: 150, y: 100 },
    B: { x: 700, y: 100 },
    C: { x: 150, y: 350 },
    D: { x: 700, y: 350 }
};

const graph = {
    A: { B: 5, C: 2 },
    B: { A: 5, D: 1 },
    C: { A: 2, D: 3 },
    D: { B: 1, C: 3 }
};

function drawGraph(path = []) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let node in graph) {

        for (let neighbor in graph[node]) {

            const start = nodes[node];
            const end = nodes[neighbor];

            ctx.beginPath();

            if (
                isPathEdge(node, neighbor, path)
            ) {
                ctx.strokeStyle = "#22c55e";
                ctx.lineWidth = 6;
            } else {
                ctx.strokeStyle = "#64748b";
                ctx.lineWidth = 2;
            }

            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;

            ctx.fillStyle = "white";
            ctx.font = "18px Arial";

            ctx.fillText(
                graph[node][neighbor],
                midX,
                midY
            );
        }
    }

    for (let node in nodes) {

        const pos = nodes[node];

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);

        if (path.includes(node)) {
            ctx.fillStyle = "#22c55e";
        } else {
            ctx.fillStyle = "#2563eb";
        }

        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";

        ctx.fillText(
            node,
            pos.x - 7,
            pos.y + 7
        );
    }
}

function isPathEdge(a, b, path) {

    for (let i = 0; i < path.length - 1; i++) {

        if (
            (path[i] === a &&
             path[i + 1] === b) ||

            (path[i] === b &&
             path[i + 1] === a)
        ) {
            return true;
        }
    }

    return false;
}

function dijkstra(graph, start) {

    let distances = {};
    let previous = {};
    let visited = {};

    for (let node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }

    distances[start] = 0;

    while (true) {

        let closestNode = null;

        for (let node in distances) {

            if (!visited[node]) {

                if (
                    closestNode === null ||
                    distances[node] <
                    distances[closestNode]
                ) {
                    closestNode = node;
                }
            }
        }

        if (closestNode === null) break;

        visited[closestNode] = true;

        for (let neighbor in graph[closestNode]) {

            let newDistance =
                distances[closestNode] +
                graph[closestNode][neighbor];

            if (
                newDistance <
                distances[neighbor]
            ) {
                distances[neighbor] = newDistance;

                previous[neighbor] =
                    closestNode;
            }
        }
    }

    return { distances, previous };
}

function getPath(previous, end) {

    let path = [];
    let current = end;

    while (current !== null) {

        path.unshift(current);

        current = previous[current];
    }

    return path;
}

function findPath() {

    const start =
        document.getElementById("startNode")
        .value;

    const end =
        document.getElementById("endNode")
        .value;

    const result =
        dijkstra(graph, start);

    const path =
        getPath(result.previous, end);

    drawGraph(path);

    document.getElementById(
        "result"
    ).innerHTML =

        `
        Distance:
        ${result.distances[end]}

        <br><br>

        Path:
        ${path.join(" → ")}
        `;
}

drawGraph();