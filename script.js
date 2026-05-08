const graph = {
    A: { B: 5, C: 2 },
    B: { A: 5, D: 1 },
    C: { A: 2, D: 3 },
    D: { B: 1, C: 3 }
};

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
                    distances[node] < distances[closestNode]
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

            if (newDistance < distances[neighbor]) {

                distances[neighbor] = newDistance;
                previous[neighbor] = closestNode;
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
        document.getElementById("startNode").value;

    const end =
        document.getElementById("endNode").value;

    const result = dijkstra(graph, start);

    const path = getPath(result.previous, end);

    document.getElementById("result").innerHTML =
        `
        Shortest Distance:
        ${result.distances[end]}
        <br><br>
        Path:
        ${path.join(" → ")}
        `;
}
