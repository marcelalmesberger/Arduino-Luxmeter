// import React modules
import React, {Component} from "react";
import "./App.css";

// import react-vis
import "../node_modules/react-vis/dist/style.css"
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from "react-vis";

// import axios
import axios from "axios";

export class App extends Component {
  
  // set initial state
  constructor(props) {
    super(props);
    this.state = {
        results: []
    }
  }

  // load file.json via http request
  componentDidMount() {
    axios.get("http://localhost:3000/file.json")
      .then(response => {
        this.setState({results: response.data.results})
      }) 
      .catch(error => console.log(error))
  }
  
  // render app
  render() {

    // save state in variable
    const data = this.state;

    // save the properties timestamp & value in an array
    const dataArray = data.results.map((d) => {
      return {x: d.timestamp, y: d.value}
    });
    console.log(dataArray);

    // return diagram
    return (
      <div className="App">
      <header className="App-header">
      <h1>Luxmeter Data</h1>
        <XYPlot width={1200} height={400}>
            <HorizontalGridLines />
            <LineSeries data={dataArray} />
            <XAxis title="time" />
            <YAxis title="lux" />
        </XYPlot>
        <h2>by Almesberger Marcel dh181812</h2>
      </header>
    </div>
    );
  }
}
// export App Component
export default App;
