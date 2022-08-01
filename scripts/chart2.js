charts.chart2 = function() {
  // initialise layout variables
  const margin = {top: 50, right: 20, bottom: 50, left: 60};
  const width = 600;
  const height = 400;

  const parseDateTime = d3.timeParse("%B %d, %Y");

  // initialise charts
  const svg = d3.select('#svg2')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // get data
  const file = 'data/opioid_crisis.json';
  d3.cachedJson(file, 'chart1', function(data) {
    data.forEach(function(d) {
      d.date = d.Total_Deaths_2019;
    });
    data = data.filter(d => d.US_Regions == "Northeast");
    const dataGroupedByRegion = Array.from(d3.group(data, d => d["State"]));
    const finalData = dataGroupedByRegion.map(
        function (item) {
           var sumDeaths = 0;
           var sumHeroin = 0;
           item[1].forEach(d => sumDeaths += d["Total_Deaths_2019"]);
          return {
            region: item[0],
            //ToDo change metrics
            //numOriginals: item[1].length
             numDeaths: sumDeaths / item[1].length
          };
        }
    ).sort()
//     .sort((a, b) => (a.region > b.region) ? 1 : -1);

    draw(finalData);
  });

  function draw(data) {
    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) {
          return d.region;
        }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 6500])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.region); })
        .attr("y", function(d) { return y(d.numDeaths); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.numDeaths); })
//         .attr("height",  y.bandwidth())
        .attr("fill", "#851839")

    // Features of the annotation
    const annotations = [
      
      {
        note: {
          label: "Top State(by opioid deaths)in US-North East Region"
        },
        connector: {
          end: "arrow"
        },
        type: d3.annotationLabel,
        x: 425,
        y: 110,
        dx: 0,
        dy: -25
      }
    ]

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
        .annotations(annotations)
    d3.select("#svg2")
        .append("g")
        .call(makeAnnotations)
  }
}
