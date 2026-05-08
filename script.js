const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

let nodes = {};
let graph = {};
let nodeCount = 0;
let selectedNode = null;

const radius = 25;
const MAX_NODES = 26;

/* ---------------- DRAW GRAPH ---------------- */

function drawGraph(path = []) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    for (let node in graph) {
        for (let neighbor in graph[node]) {

            // Prevent duplicate lines
            if (node < neighbor) {

                const start = nodes[node];
                const end = nodes[neighbor];

                ctx.beginPath();

                if (isPathEdge(node, neighbor, path)) {
                    ctx.strokeStyle = "#22c55e";
                    ctx.lineWidth = 5;
                } else {
                    ctx.strokeStyle = "#64748b";
                    ctx.lineWidth = 2;
                }

                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();

                // Edge weight label with background for readability
                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;
                const weight = graph[node][neighbor];

                ctx.font = "bold 14px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                const textWidth = ctx.measureText(weight).width;
                const padding = 4;

                // Draw pill background behind weight
                ctx.fillStyle = "#1e293b";
                ctx.beginPath();
                ctx.roundRect(
                    midX - textWidth / 2 - padding,
                    midY - 10,
                    textWidth + padding * 2,
                    20,
                    5
                );
                ctx.fill();

                ctx.fillStyle = "#facc15";
                ctx.fillText(weight, midX, midY);
            }
        }
    }

    // Draw nodes
    for (let node in nodes) {

        const pos = nodes[node];

        // Outer glow ring for selected node
        if (node === selectedNode) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);

        if (path.includes(node)) {
            ctx.fillStyle = "#22c55e";
        } else if (node === selectedNode) {
            ctx.fillStyle = "#f59e0b";
        } else {
            ctx.fillStyle = "#2563eb";
        }

        ctx.fill();

        // BUG FIX: use textAlign/textBaseline for proper centering
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node, pos.x, pos.y);
    }
}

/* ---------------- PATH EDGE CHECK ---------------- */

function isPathEdge(a, b, path) {
    for (let i = 0; i < path.length - 1; i++) {
        if (
            (path[i] === a && path[i + 1] === b) ||
            (path[i] === b && path[i + 1] === a)
        ) {
            return true;
        }
    }
    return false;
}

/* ---------------- NODE DETECTION ---------------- */

function getClickedNode(x, y) {
    for (let node in nodes) {
        const dx = x - nodes[node].x;
        const dy = y - nodes[node].y;
        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
            return node;
        }
    }
    return null;
}

/* ---------------- CANVAS CLICK ---------------- */

canvas.addEventListener("click", function (e) {

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = getClickedNode(x, y);

    if (clickedNode) {

        if (!selectedNode) {
            // First node selected — highlight it
            selectedNode = clickedNode;
            drawGraph();

        } else {

            if (selectedNode !== clickedNode) {
                const weightStr = prompt(`Enter distance between ${selectedNode} and ${clickedNode}:`);

                // BUG FIX: validate input — reject null, empty, or non-numeric
                if (weightStr !== null && weightStr.trim() !== "") {
                    const weight = Number(weightStr);

                    if (isNaN(weight) || weight <= 0) {
                        alert("Please enter a valid positive number.");
                    } else {
                        graph[selectedNode][clickedNode] = weight;
                        graph[clickedNode][selectedNode] = weight;
                    }
                }
            }

            selectedNode = null;
            // BUG FIX: always redraw after edge attempt (even if cancelled)
            drawGraph();
        }

    } else {

        // BUG FIX: guard against exceeding 26-node limit
        if (nodeCount >= MAX_NODES) {
            alert("Maximum of 26 nodes reached.");
            return;
        }

        const nodeName = String.fromCharCode(65 + nodeCount);
        nodes[nodeName] = { x, y };
        graph[nodeName] = {};
        nodeCount++;

        updateSelectors();
        drawGraph();
    }
});

/* ---------------- UPDATE DROPDOWNS ---------------- */

function updateSelectors() {

    const start = document.getElementById("startNode");
    const end = document.getElementById("endNode");

    start.innerHTML = "";
    end.innerHTML = "";

    for (let node in nodes) {

        const option1 = document.createElement("option");
        option1.value = node;
        option1.textContent = node;
        start.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = node;
        option2.textContent = node;
        end.appendChild(option2);
    }
}

/* ---------------- DIJKSTRA ---------------- */

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
                if (closestNode === null || distances[node] < distances[closestNode]) {
                    closestNode = node;
                }
            }
        }

        if (closestNode === null || distances[closestNode] === Infinity) break;

        visited[closestNode] = true;

        for (let neighbor in graph[closestNode]) {
            const newDistance = distances[closestNode] + graph[closestNode][neighbor];
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = closestNode;
            }
        }
    }

    return { distances, previous };
}

/* ---------------- BUILD PATH ---------------- */

function getPath(previous, end) {

    let path = [];
    let current = end;

    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    return path;
}

/* ---------------- FIND PATH ---------------- */

function findPath() {

    const start = document.getElementById("startNode").value;
    const end = document.getElementById("endNode").value;

    if (!start || !end) {
        alert("Create nodes first!");
        return;
    }

    if (start === end) {
        alert("Start and end nodes are the same!");
        return;
    }

    const result = dijkstra(graph, start);
    const path = getPath(result.previous, end);
    const dist = result.distances[end];

    // BUG FIX: check for unreachable node
    if (dist === Infinity || path.length < 2 || path[0] !== start) {
        document.getElementById("result").innerHTML =
            `<span style="color:#f87171;">No path found between <b>${start}</b> and <b>${end}</b>.</span>`;
        drawGraph();
        return;
    }

    drawGraph(path);

    document.getElementById("result").innerHTML = `
        <b>Shortest Distance:</b> ${dist}
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <b>Path:</b> ${path.join(" → ")}
    `;
}

/* ---------------- RESET ---------------- */

function resetGraph() {
    nodes = {};
    graph = {};
    nodeCount = 0;
    selectedNode = null;
    updateSelectors();
    drawGraph();
    document.getElementById("result").innerHTML = "";
}

/* Make functions global for buttons */
window.findPath = findPath;
window.resetGraph = resetGraph;

/* Initial draw */
drawGraph();