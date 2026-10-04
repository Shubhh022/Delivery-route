
let locations = deliveryNetwork.locations;
let roads = deliveryNetwork.roads;

let fromLocation = document.getElementById("fromLocation");
let toLocation = document.getElementById("toLocation");
let findRouteButton = document.getElementById("findRouteButton");

let routeSteps = document.getElementById("routeSteps");
let distance = document.getElementById("distance");
let stops = document.getElementById("stops");
let time = document.getElementById("time");

for (let i = 0; i < locations.length; i++) {

    let option1 = document.createElement("option");
    option1.value = locations[i].id;
    option1.textContent = locations[i].name;
    fromLocation.appendChild(option1);

    let option2 = document.createElement("option");
    option2.value = locations[i].id;
    option2.textContent = locations[i].name;
    toLocation.appendChild(option2);
}

function findShortestRoute(start, end) {

    let distanceList = {};
    let previous = {};
    let visited = {};

    for (let i = 0; i < locations.length; i++) {

        let id = locations[i].id;

        distanceList[id] = Infinity;
        previous[id] = null;
        visited[id] = false;
    }

    distanceList[start] = 0;

    for (let i = 0; i < locations.length; i++) {

        let current = null;
        let smallest = Infinity;

        for (let j = 0; j < locations.length; j++) {

            let id = locations[j].id;

            if (visited[id] == false && distanceList[id] < smallest) {
                smallest = distanceList[id];
                current = id;
            }
        }

        if (current == null) {
            break;
        }

        visited[current] = true;

        for (let j = 0; j < roads.length; j++) {

            let road = roads[j];
            let next = null;

            if (road.from == current) {
                next = road.to;
            }
            else if (road.to == current) {
                next = road.from;
            }

            if (next != null) {

                let newDistance = distanceList[current] + road.distance;

                if (newDistance < distanceList[next]) {
                    distanceList[next] = newDistance;
                    previous[next] = current;
                }
            }
        }
    }

    let route = [];
    let current = end;

    while (current != null) {
        route.unshift(current);
        current = previous[current];
    }

    return {
        route: route,
        distance: distanceList[end]
    };
}

function getLocationName(id) {

    for (let i = 0; i < locations.length; i++) {

        if (locations[i].id == id) {
            return locations[i].name;
        }
    }

    return "";
}

function displayRoute(result) {

    routeSteps.innerHTML = "";

    for (let i = 0; i < result.route.length; i++) {

        let name = getLocationName(result.route[i]);

        let locationElement = document.createElement("div");

        locationElement.className = "route-location";
        locationElement.textContent = name;

        routeSteps.appendChild(locationElement);

        if (i < result.route.length - 1) {

            let arrow = document.createElement("div");

            arrow.className = "route-arrow";
            arrow.textContent = "↓";

            routeSteps.appendChild(arrow);
        }
    }

    distance.textContent = result.distance + " km";
    stops.textContent = result.route.length;

    let estimatedTime = result.distance * 5;

    time.textContent = estimatedTime + " minutes";
}

findRouteButton.addEventListener("click", function() {

    let start = fromLocation.value;
    let end = toLocation.value;

    if (start == "" || end == "") {
        alert("Please select both locations.");
        return;
    }

    if (start == end) {
        alert("Please select two different locations.");
        return;
    }

    let result = findShortestRoute(start, end);

    displayRoute(result);
});

