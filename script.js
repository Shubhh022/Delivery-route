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

function findShortestRoute(startId, endId) {
    let distances = {};
    let previous = {};
    let visited = {};

    for (let i = 0; i < locations.length; i++) {
        let id = locations[i].id;

        distances[id] = Infinity;
        previous[id] = null;
        visited[id] = false;
    }

    distances[startId] = 0;

    for (let i = 0; i < locations.length; i++) {
        let currentLocation = null;
        let smallestDistance = Infinity;

        for (let j = 0; j < locations.length; j++) {
            let id = locations[j].id;

            if (visited[id] == false && distances[id] < smallestDistance) {
                smallestDistance = distances[id];
                currentLocation = id;
            }
        }

        if (currentLocation == null) {
            break;
        }

        visited[currentLocation] = true;

        for (let j = 0; j < roads.length; j++) {
            let road = roads[j];
            let nextLocation = null;

            if (road.from == currentLocation) {
                nextLocation = road.to;
            } else if (road.to == currentLocation) {
                nextLocation = road.from;
            }

            if (nextLocation != null) {
                let newDistance = distances[currentLocation] + road.distance;

                if (newDistance < distances[nextLocation]) {
                    distances[nextLocation] = newDistance;
                    previous[nextLocation] = currentLocation;
                }
            }
        }
    }

    let route = [];
    let currentLocation = endId;

    while (currentLocation != null) {
        route.unshift(currentLocation);
        currentLocation = previous[currentLocation];
    }

    return {
        route: route,
        distance: distances[endId]
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
        let locationName = getLocationName(result.route[i]);

        let locationElement = document.createElement("div");
        locationElement.className = "route-location";
        locationElement.textContent = locationName;

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
    let startId = fromLocation.value;
    let endId = toLocation.value;

    if (startId == "" || endId == "") {
        alert("Please select both locations.");
        return;
    }

    if (startId == endId) {
        alert("Please select two different locations.");
        return;
    }

    let result = findShortestRoute(startId, endId);

    displayRoute(result);
});