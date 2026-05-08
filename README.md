# SmartPath Navigator

I built this project to visualize how shortest path algorithms actually work — the kind of thing that powers Google Maps under the hood. You can create your own graph on a canvas, connect nodes with weighted edges, and watch Dijkstra's algorithm find the optimal route in real time.

---

## Live Demo

[Open SmartPath Navigator](https://yoshinoGrg.github.io/smartpath-navigator/)

---

## Demo

![SmartPath Navigator Demo](./assets/demo.png)

---

## What it does

- Click anywhere on the canvas to place nodes
- Click two nodes to connect them and set a distance (edge weight)
- Select a start and end node, hit **Find Path**
- The shortest path lights up green instantly
- Hit **Reset** to start over

---

## Tech Used

- HTML5 Canvas API — for all the drawing
- Vanilla JavaScript — no frameworks, just logic
- CSS3 — dark UI styling
- Dijkstra's Algorithm — the core DSA brain of the project

---

## How it works

The canvas acts like a map. Every node you place is a city or intersection, every edge you draw is a road, and the weight you enter is the distance.

When you click **Find Path**, the app runs Dijkstra's algorithm on the adjacency list representation of your graph and traces back the shortest route using a `previous[]` array.

---

## DSA behind it

### Graph (Adjacency List)

```js
graph["A"] = { B: 5, C: 2 }
```

Node A connects to B with distance 5, and to C with distance 2.

### Dijkstra's Algorithm

Core idea — keep relaxing edges until you find the shortest path:

```
d(v) = min(d(v), d(u) + w(u, v))
```

- `d(v)` — best known distance to v
- `d(u)` — distance to current node u
- `w(u, v)` — weight of edge between u and v

### Time Complexity

| Version | Complexity |
|---|---|
| Basic (array scan) | O(V²) |
| Optimized (priority queue) | O((V + E) log V) |

This project uses the basic version since the graph sizes are small.

---

## Project Structure

```
smartpath-navigator/
│
├── index.html
├── style.css
├── script.js
├── assets/
│   └── demo.png
└── README.md
```

---

## What I want to add later

- A\* pathfinding for comparison
- Drag-and-drop to move nodes around
- Step-by-step animated traversal so you can see the algorithm exploring
- Traffic weights that change in real time
- Maybe OpenStreetMap tiles for a real map background

---

## Real-world uses of this

This is basically a simplified version of what's inside:

- Google Maps / GPS navigation
- Delivery route optimization
- Network packet routing
- Robot path planning
- Game AI movement

---

## Author

**Suraj Gurung**  
BTech CSE Student  
[GitHub](https://github.com/yoshinoGrg)
