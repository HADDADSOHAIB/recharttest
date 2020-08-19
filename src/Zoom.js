import React, { PureComponent, useEffect, useState } from 'react';
import {
  Label, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, Legend,
} from 'recharts';
import axios from 'axios';
import handelFile from './handleFile';
import RangeSlider from 'react-bootstrap-range-slider';

const colors = [
  '#FF6633', '#FF33FF', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

let dataStart = [
  {
    name: 1,
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    "name": 2,
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": 3,
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": 3+1,
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": 5,
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": 6,
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": 7,
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
];


function CustomizedLegend({show, handleClick, meta, handleSlide}) {
  const [ value, setValue ] = useState(0);

  useEffect(() => {
    handleSlide(value);
    return () => ''
  }, [value]);

  return (
    <div>
      <div>
        <RangeSlider
          value={value}
          onChange={changeEvent => setValue(changeEvent.target.value)}
          max={dataStart.length}
        />
        <input type="number" value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <ul style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none'}}>
        {
          Object.keys(dataStart[0]).map((dataKey, index) => {
            if (dataKey !== 'name') {
              return (
                <li
                  key={`item-${dataKey}`}
                  onClick={() => handleClick(dataKey)}
                  style={{ marginLeft: '10px', color: colors[index] }}
                >
                  <input type="checkbox" id={index} name={index} checked={show[dataKey]}/>
                  <label style={{ marginLeft: '5px' }} for={index}>{dataKey}: {meta && meta[dataKey].name} {meta && meta[dataKey].unit}</label>
                </li>
              )
            }
          })
        }
      </ul>
    </div>
  )
};

const getAxisYDomain = (from, to, ref, offset, data) => {
  const refData = data.slice(from, to + 1);

  if (refData[0][ref] !== undefined) {
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d, i) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });
    return [bottom - offset, top + offset];
  } else return [0, 0];
};

const findMinMaxData = (start, end, data, show) => {
  let minMaxs = [];
  if (dataStart[0]) {
    minMaxs = Object.keys(data[0]).map(el => {
      if (el !== 'name' && show[el]) {
        return getAxisYDomain(start, end, el, 300, data);
      } else {
        return [null, null];
      }
    });
  }

  return [
    minMaxs.map(el => el ? el[0] : minMaxs[0][0])
      .reduce((memo, item) => (item && memo > item ? item : memo), minMaxs[0][0]),
    minMaxs.map(el => el ? el[1]: minMaxs[0][1])
      .reduce((memo, item) => (item && memo < item ? item : memo), minMaxs[0][1])
  ]
}

const initialState = {
  data: dataStart,
  left: dataStart[0].name,
  right: dataStart[dataStart.length - 1].name,
  refAreaLeft: '',
  refAreaRight: '',
  top: 10000,
  bottom: 0,
  animation: true,
  meta: null,
  show: {},
};

const CustomTooltip = ({ active, payload, label }) => {
  useEffect(() => {
    return () => ''
  }, [payload, active, label])

  return <p>test</p>;
};

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/nhpemhgs/';

  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleClick = this.handleClick.bind(this);
    this.handleSlide = this.handleSlide.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:3001/records/5f26d1f3b0dbc533f9a0dac5')
      .then(res => {
        const { data, meta }= handelFile(res.data.data.file);
        dataStart = data;
        const show = {};
        Object.keys(data[0]).forEach((item, i) => {
          show[item] = i <= 5 && item !== 'name';
        });
        const [min, max] = findMinMaxData(0, data.length, data, show);
        this.setState(() => ({
          data: data.slice(0, 100),
          top: max + 0.3 * max,
          bottom: min - 0.2 * min,
          left: 0,
          right: 100,
          meta,
          show 
        }));
      }).catch(err => console.log(err));
  }

  zoom() {
    let { refAreaLeft, refAreaRight, data, show } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const [bottom, top] = findMinMaxData(refAreaLeft, refAreaRight, dataStart, show);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: dataStart.slice(refAreaLeft, refAreaRight + 1),
      left: refAreaLeft,
      right: refAreaRight,
      top: top + 0.3 * top,
      bottom: bottom - 0.2 * bottom,
    }));
  }

  zoomOut() {
    const { data, show } = this.state;
    const index = Math.round((data[0].name + data[data.length - 1].name)/2);
    const left = Math.max(0, index - 50);
    const right = Math.min(dataStart.length, index + 50);
    const [min, max] = findMinMaxData(left, right, dataStart, show);
    this.setState(() => ({
      data: dataStart.slice(left, right),
      refAreaLeft: '',
      refAreaRight: '',
      left,
      right,
      top: max + 0.3 * max,
      bottom: min - 0.2 * min,
    }));
  }

  handleClick(dataKey){
    const { show, left, right } = this.state;
    show[dataKey] = !show[dataKey];
    const [min, max] = findMinMaxData(left, right, dataStart, show);
    this.setState(() => ({
      show: { ...show },
      top: max + 0.3 * max,
      bottom: min - 0.2 * min,
    }));
  }

  handleSlide(value){
    const percent = (value / dataStart.length) * 100;
    const index = Math.round(percent * dataStart.length/100);
    const left = Math.max(0, index - 50);
    const right = Math.min(dataStart.length, index + 50);
    
    this.setState(() => ({ data: dataStart.slice(left, right), left, right }));
  }

  render() {
    const {
      data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, meta, show
    } = this.state;

    return (
      <div className="highlight-bar-charts" style={{ userSelect: 'none' }}>
        <button
          // href="javascript: void(0);"
          className="btn update"
          onClick={this.zoomOut.bind(this)}
        >
          Zoom Out
        </button>
        <LineChart
          width={800}
          height={1000}
          data={data}
          onMouseDown={e => e && this.setState({ refAreaLeft: e.activeLabel })}
          onMouseMove={e => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
          onMouseUp={this.zoom.bind(this)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            allowDataOverflow
            dataKey="name"
            domain={[left, right]}
            type="number"
          />
          <YAxis
            allowDataOverflow
            domain={[bottom, top]}
            type="number"
            yAxisId="1"
            hide
          />
          <Tooltip />
          <Legend content={<CustomizedLegend handleClick={this.handleClick} handleSlide={this.handleSlide} show={show} meta={meta} />} />
          {
            Object.keys(data[0]).map((el, i) => {
              if(el !== 'name' && show[el]) {
                return (<Line yAxisId="1" type="natural" dataKey={el} stroke={colors[i]} dot={false} animationDuration={300} />)
              }
            })
          }
          {
            (refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />) : null
            }
        </LineChart>

      </div>
    );
  }
}
