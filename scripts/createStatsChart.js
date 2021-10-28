const { writeFileSync, readFileSync } = require("fs");
const { resolve } = require("path");

const json = readFileSync(resolve(__dirname, "out/stats.json"));
if (!json) {
  console.log("Could not find 'out/stats.json'. You may need to do 'npm run downloadStats' first.");
  process.exit(1);
}

const stats = JSON.parse(json).map((s) => JSON.parse(s));
const keys = Object.keys(stats[0]);

let currentColor = 0;
const colors = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

let datasets = [];
keys.forEach((k) => {
  if (k === "pickedColors" || k === "cardsPlayed") return;

  datasets.push({
    label: k,
    data: stats.map((s) => s[k]).reverse(),
    borderColor: colors[currentColor % colors.length],
    backgroundColor: colors[currentColor % colors.length],
  });

  currentColor++;
});

const time = Date.now();
const labels = stats
  .map((s, i) => {
    const date = new Date();
    date.setTime(time - i * 300 * 1000);
    return date.toUTCString();
  })
  .reverse();

const libs = `
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@1.1.1/dist/chartjs-plugin-zoom.min.js"></script>
`;
const canvas = `<canvas id="chart"></canvas>`;

const script = `
<script>
const data = {
  labels: ${JSON.stringify(labels)},
  datasets: ${JSON.stringify(datasets)}
}

const config = {
  type: "line",
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Scuffed Uno Stats"
      }
    }
  },
  options: {
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          mode: "x",
          wheel: {
            enabled: true
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
};

const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, config);

</script>
`;

const html = `
<html>
<head>
<title>Scuffed Uno Stats Chart</title>

<style>
.chartWrapper {
    position: relative;
}

.chartWrapper > canvas {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events:none;
}

.chartAreaWrapper {
    width: 600px;
    overflow-x: scroll;
}
</style>
</head>

<body>
${canvas}

${libs}
${script}
</body>
</html>
`;

const outputFile = resolve(__dirname, "out/stats-chart.html");
writeFileSync(outputFile, html);
