function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadata = `/metadata/${sample}`;


  // const dataPromise = d3.json(metadata);
  d3.json(metadata).then(function (response) {
    //console.log(response);
    // function meta(response){
    // Use d3 to select the panel with id of `#sample-metadata`
    var metatable = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metatable.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(function ([key, value]) {
      //console.log(key, value);
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      metatable.append("p").text(`${key}, ${value}`)
    })

    //}
  });
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampledata = `/samples/${sample}`;
  // @TODO: Build a Bubble Chart using the sample data

  d3.json(sampledata).then(function (response2) {

    //console.log(response2);
    var bubbledata = response2;

    var trace1 = {
      x: bubbledata.otu_ids,
      y: bubbledata.sample_values,
      mode: 'markers',
      marker: {
        color: bubbledata.sample_values,
        size: bubbledata.sample_values
      },
      text: bubbledata.otu_labels,
    };

    var databubble = trace1

    var layout = {
      title: "Bubble chart",
      xaxis: { title: "id" },
      yaxis: { title: "Values" }
    };
    Plotly.newPlot("bubble", [databubble], layout);



    // @TODO: Build a Pie Chart

    var piedata = response2

    var trace2 = {
      labels: piedata.otu_ids.slice(0, 10),
      values: piedata.sample_values.slice(0, 10),
      text: piedata.otu_labels.slice(0, 10),
      type: 'pie'
    };

    var data = [trace1];

    var pielayout = {
      title: "Pie Chart",
    };

    var data = trace2;

    Plotly.newPlot("pie", [data], pielayout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
//console.log(buildMetadata(940));
init();

