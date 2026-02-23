let curr_val = "Revenue";
let curr_yr = 1992;
let play_pause = false;
let scale_yr = true;
let dataset = [];
let states = [];
const color_func = d3.interpolateGreens;
const map = {
  "Revenue": "Totals.Revenue",
  "Expenses": "Totals.Expenditure",
  "General Revenue": "Totals.General revenue",
  "General Expenditure": "Totals.General expenditure",
  "Capital Outlay": "Totals.Capital outlay"
};
const abbreviation = {
  "AL": "ALABAMA", "AK": "ALASKA", "AZ": "ARIZONA", "AR": "ARKANSAS", "CA": "CALIFORNIA",
  "CO": "COLORADO", "CT": "CONNECTICUT", "DE": "DELAWARE", "FL": "FLORIDA", "GA": "GEORGIA",
  "HI": "HAWAII", "ID": "IDAHO", "IL": "ILLINOIS", "IN": "INDIANA", "IA": "IOWA",
  "KS": "KANSAS", "KY": "KENTUCKY", "LA": "LOUISIANA", "ME": "MAINE", "MD": "MARYLAND",
  "MA": "MASSACHUSETTS", "MI": "MICHIGAN", "MN": "MINNESOTA", "MS": "MISSISSIPPI", "MO": "MISSOURI",
  "MT": "MONTANA", "NE": "NEBRASKA", "NV": "NEVADA", "NH": "NEW HAMPSHIRE", "NJ": "NEW JERSEY",
  "NM": "NEW MEXICO", "NY": "NEW YORK", "NC": "NORTH CAROLINA", "ND": "NORTH DAKOTA", "OH": "OHIO",
  "OK": "OKLAHOMA", "OR": "OREGON", "PA": "PENNSYLVANIA", "RI": "RHODE ISLAND", "SC": "SOUTH CAROLINA",
  "SD": "SOUTH DAKOTA", "TN": "TENNESSEE", "TX": "TEXAS", "UT": "UTAH", "VT": "VERMONT",
  "VA": "VIRGINIA", "WA": "WASHINGTON", "WV": "WEST VIRGINIA", "WI": "WISCONSIN", "WY": "WYOMING"
};
const abbrevation_to_short = Object.fromEntries(
  Object.entries(abbreviation).map(([abbr, full]) => [full, abbr])
);
const map_layout = [
  { state: "WA", col: 0, row: 0 }, { state: "ID", col: 1, row: 0 }, { state: "MT", col: 2, row: 0 }, { state: "ND", col: 3, row: 0 }, { state: "MN", col: 4, row: 0 },
  { state: "OR", col: 0, row: 1 }, { state: "NV", col: 1, row: 1 }, { state: "WY", col: 2, row: 1 }, { state: "SD", col: 3, row: 1 }, { state: "WI", col: 4, row: 1 },
  { state: "CA", col: 0, row: 2 }, { state: "UT", col: 1, row: 2 }, { state: "CO", col: 2, row: 2 }, { state: "NE", col: 3, row: 2 }, { state: "IA", col: 4, row: 2 },
  { state: "AZ", col: 0, row: 3 }, { state: "NM", col: 1, row: 3 }, { state: "KS", col: 2, row: 3 }, { state: "MO", col: 3, row: 3 }, { state: "IL", col: 4, row: 3 },
  { state: "OK", col: 2, row: 4 }, { state: "AR", col: 3, row: 4 }, { state: "LA", col: 4, row: 4 },
  { state: "TX", col: 2, row: 5 }, { state: "MS", col: 3, row: 5 }, { state: "AL", col: 4, row: 5 },
  { state: "MI", col: 5, row: 0 }, { state: "IN", col: 5, row: 1 }, { state: "OH", col: 5, row: 2 }, { state: "KY", col: 5, row: 3 },
  { state: "TN", col: 5, row: 4 }, { state: "GA", col: 5, row: 5 }, { state: "FL", col: 5, row: 6 },
  { state: "PA", col: 6, row: 1 }, { state: "WV", col: 6, row: 2 }, { state: "VA", col: 6, row: 3 }, { state: "NC", col: 6, row: 4 }, { state: "SC", col: 6, row: 5 },
  { state: "NY", col: 7, row: 0 }, { state: "VT", col: 7, row: 1 }, { state: "MA", col: 7, row: 2 }, { state: "CT", col: 7, row: 3 }, { state: "NJ", col: 7, row: 4 },
  { state: "DE", col: 7, row: 5 }, { state: "MD", col: 6, row: 6 }, { state: "ME", col: 8, row: 0 }, { state: "NH", col: 8, row: 1 },
  { state: "AK", col: 0, row: 6 }, { state: "HI", col: 1, row: 6 }
];
function hexCorner(centerX, centerY, size, i) {
  const angle_deg = 60 * i - 30;
  const angle_rad = Math.PI / 180 * angle_deg;
  return [centerX + size * Math.cos(angle_rad), centerY + size * Math.sin(angle_rad)];
}
function hexagonPath(cx, cy, r) {
  const corners = Array.from({ length: 6 }, (_, i) => hexCorner(cx, cy, r, i));
  return d3.line()(corners.concat([corners[0]]));
}
function updateHexMap() {
  const hex_rad = 30;
  const hex_height = 2 * hex_rad;
  const hex_wid = Math.sqrt(3) * hex_rad;

  const curr_key = map[curr_val];
  const curr_data = dataset.filter(d => d.Year === curr_yr);
  const data_mapping = Object.fromEntries(curr_data.map(d => [d.State, d]));

  const color_range = scale_yr
    ? [0, d3.max(curr_data, d => d[curr_key])]
    : [0, d3.max(dataset, d => d[curr_key])];

  const colorFunc = d3.scaleSequential(color_func).domain(color_range);

  d3.select("#hex-map-panel").selectAll("*").remove();

  const svg = d3.select("#hex-map-panel")
    .append("svg")
    .attr("width", 800)
    .attr("height", 550);

    let lassoCoords = [];
let tempSelectedStates = new Set();
svg.on("mousedown", function (event) {
  lassoCoords = [d3.pointer(event, this)];
svg.append("path")
  .attr("class", "lasso-path")
  .datum(lassoCoords)
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 1.5)
  .attr("stroke-dasharray", "4,2");


  tempSelectedStates.clear();
  d3.selectAll(".state-hex").classed("selected", false);
});
svg.on("mousemove", function (event) {
  if (lassoCoords.length === 0) return;

  const currentPoint = d3.pointer(event, this);
  lassoCoords.push(currentPoint);

  d3.select(".lasso-path")
    .datum(lassoCoords)
    .attr("d", d3.line().curve(d3.curveLinearClosed));
});
svg.on("mouseup", function () {
  if (lassoCoords.length > 1) {
    const polygonShape = lassoCoords.map(p => [p[0], p[1]]);

    d3.selectAll(".state-hex").each(function (d) {
      const bbox = this.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      const isInside = d3.polygonContains(polygonShape, [cx, cy]);

      if (isInside) {
        tempSelectedStates.add(d.fullState);
      }
    });

    states = Array.from(tempSelectedStates);
    d3.selectAll(".state-hex").classed("selected", d => states.includes(d.fullState));
    updateLineChart();
  }

  lassoCoords = [];
  d3.select(".lasso-path").remove();
});


  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .style("pointer-events", "none")
    .style("display", "none");

  svg.append("g")
    .selectAll("path")
    .data(map_layout.map(d => {
      const fullName = abbreviation[d.state];
      console.log(fullName);
      const value = data_mapping[fullName]?.[curr_key];
      const x = d.col * hex_wid + (d.row % 2 === 1 ? hex_wid / 2 : 0) + 50;
      const y = d.row * hex_height * 0.75 + 50;
      return { ...d, x, y, state: d.state, fullState: fullName, value };
    }))
    .enter()
    .append("path")
    .attr("class", "state-hex")
    .attr("d", d => hexagonPath(d.x, d.y, hex_rad))
    .attr("fill", d => d.value !== undefined ? colorFunc(d.value) : "#ccc")
    .attr("stroke", "#000")
    .on("mouseover", function (event, d) {
      tooltip.style("display", "block")
        .html(d.state)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
    })
    .on("click", (event, d) => {
      states = [d.fullState];
      updateLineChart();
    });
    svg.append("g")
    .selectAll("text")     
    .data(map_layout.map(d => {
        const fullName = abbreviation[d.state];
        // console.log(fullName);
        const value = data_mapping[fullName]?.[curr_key];
        const x = d.col * hex_wid + (d.row % 2 === 1 ? hex_wid / 2 : 0) + 50;
        const y = d.row * hex_height * 0.75 + 50;
        return { ...d, x, y, state: d.state, fullState: fullName, value };
      }))
    .enter()
    .append("text")
    .attr("x", d => d.x )
    .attr("y", d => d.y + 4)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "10px")
   
    // .attr("fill", "#000")
    .attr("fill", "black") 
.attr("font-weight", "bold")
  .text(d => {
    return d.state}
    );
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient").attr("id", "legend-gradient");
  gradient.append("stop").attr("offset", "0%").attr("stop-color", color_func(0));
  gradient.append("stop").attr("offset", "100%").attr("stop-color", color_func(1));
  svg.append("rect")
    .attr("x", 550)
    .attr("y", 490)
    .attr("width", 200)
    .attr("height", 15)
    .style("fill", "url(#legend-gradient)")
    .attr("stroke", "black");

  svg.append("text")
    .attr("x", 550)
    .attr("y", 485)
    .attr("font-size", "10px")
    .text(Math.round(color_range[0]));

  svg.append("text")
    .attr("x", 750)
    .attr("y", 485)
    .attr("font-size", "10px")
    .attr("text-anchor", "end")
    .text(Math.round(color_range[1]));
}

d3.csv("finance.csv").then(data => {
  data.forEach(d => {
    d.Year = +d.Year;
    d.State = d.State.trim();
    for (const key in map) {
      const columnName = map[key];
      d[columnName] = +d[columnName];
    }
  });
  dataset = data;
  initializeVisualization();
});

function initializeVisualization() {
  initializeControls();
  updateHexMap();
  updateLineChart();
}

function initializeControls() {
  d3.select("#attribute-select").on("change", function () {
    curr_val = this.value;
    states = [];
    updateHexMap();
    updateLineChart();
  });

  d3.select("#scale-toggle").on("change", function () {
    scale_yr = this.checked;
    d3.select("#scale-label").text(scale_yr ? "Current Year" : "All Years");
    updateHexMap();
    updateLineChart();
  });

  d3.select("#year-slider").on("input", function () {
    curr_yr = +this.value;
    d3.select("#year-label").text(curr_yr);
    updateHexMap();
    updateLineChart();
  });

  d3.select("#play-button").on("click", function () {
    play_pause = !play_pause;
    this.textContent = play_pause ? "Pause" : "Play";
    if (play_pause) playAnimation();
  });
}
function playAnimation() {
  if (play_pause) {
    curr_yr = curr_yr < 2019 ? curr_yr + 1 : 1992;
    d3.select("#year-slider").property("value", curr_yr);
    d3.select("#year-label").text(curr_yr);
    updateHexMap();
    updateLineChart();
    setTimeout(playAnimation, 1000);
  }
}
function updateLineChart() {
  const curr_key = map[curr_val];
  const svgWidth = 800;
  const svgHeight = 500;
  const margin = { top: 30, right: 30, bottom: 50, left: 60 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  d3.select("#line-chart-panel").selectAll("*").remove();

  const svg = d3.select("#line-chart-panel")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([1992, 2019]).range([0, width]);
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  const statesToPlot = states.length > 0 ? states : [];

  if (statesToPlot.length === 0) {
    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(d3.scaleLinear().domain([0, 1]).range([height, 0])));
    return;
  }

  const grouped = statesToPlot.map(state => ({
    state,
    values: dataset.filter(d => d.State === state && !isNaN(d[curr_key]) && !isNaN(d.Year))
  }));

  const flatValues = grouped.flatMap(d => d.values.map(v => v[curr_key]));
  const yExtent = d3.extent(flatValues);

  const y = d3.scaleLinear()
    .domain([yExtent[0] * 0.95, yExtent[1] * 1.05])
    .range([height, 0]);

  g.append("g")
    .attr("class", "y-axis")
    .transition()
    .duration(500)
    .call(d3.axisLeft(y));

  const line = d3.line()
    .defined(d => !isNaN(d[curr_key]) && !isNaN(d.Year))
    .x(d => x(d.Year))
    .y(d => y(d[curr_key]));

  g.selectAll(".line")
    .data(grouped)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", d => line(d.values))
    .attr("stroke", "green")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("opacity", 0.7);

  g.selectAll(".year-line")
    .data([curr_yr])
    .join("line")
    .attr("class", "year-line")
    .attr("x1", x(curr_yr))
    .attr("x2", x(curr_yr))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "gray")
    .attr("stroke-dasharray", "4")
    .attr("stroke-width", 2);
}

