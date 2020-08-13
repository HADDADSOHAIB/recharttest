import React, { PureComponent, useEffect } from 'react';
import {
  Label, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, Legend,
} from 'recharts';
import axios from 'axios';
import handelFile from './handleFile';

const colors = [
  '#D50000',
  '#E91E63',
  '#FCE4EC',
  '#F8BBD0',
  '#F48FB1',
  '#F06292',
  '#EC407A',
  '#E91E63',
  '#D81B60',
  '#C2185B',
  '#AD1457',
  '#880E4F',
  '#FF80AB',
  '#FF4081',
  '#F50057',
  '#C51162',
  '#9C27B0',
  '#F3E5F5',
  '#E1BEE7',
  '#CE93D8',
  '#BA68C8',
  '#AB47BC',
  '#9C27B0',
  '#8E24AA',
  '#7B1FA2',
  '#6A1B9A',
  '#4A148C',
  '#EA80FC',
  '#E040FB',
  '#D500F9',
  '#AA00FF',
  '#673AB7',
  '#EDE7F6',
  '#D1C4E9',
  '#B39DDB',
  '#9575CD',
  '#7E57C2',
  '#673AB7',
  '#5E35B1',
  '#512DA8',
  '#4527A0',
  '#311B92',
  '#B388FF',
  '#7C4DFF',
  '#651FFF',
  '#6200EA',
  '#3F51B5',
  '#E8EAF6',
  '#C5CAE9',
  '#9FA8DA',
  '#7986CB',
  '#5C6BC0',
  '#3F51B5',
  '#3949AB',
  '#303F9F',
  '#283593',
  '#1A237E',
  '#8C9EFF',
  '#536DFE',
  '#3D5AFE',
  '#304FFE',
  '#2196F3',
  '#E3F2FD',
  '#BBDEFB',
  '#90CAF9',
  '#64B5F6',
  '#42A5F5',
  '#2196F3',
  '#1E88E5',
  '#1976D2',
  '#1565C0',
  '#0D47A1',
  '#82B1FF',
  '#448AFF',
  '#2979FF',
  '#2962FF',
  '#03A9F4',
  '#E1F5FE',
  '#B3E5FC',
  '#81D4FA',
  '#4FC3F7',
  '#29B6F6',
  '#03A9F4',
  '#039BE5',
  '#0288D1',
  '#0277BD',
  '#01579B',
  '#80D8FF',
  '#40C4FF',
  '#00B0FF',
  '#0091EA',
  '#00BCD4',
  '#E0F7FA',
  '#B2EBF2',
  '#80DEEA',
  '#4DD0E1',
  '#26C6DA',
  '#00BCD4',
  '#00ACC1',
  '#0097A7',
  '#00838F',
  '#006064',
  '#84FFFF',
  '#18FFFF',
  '#00E5FF',
  '#00B8D4',
  '#009688',
  '#E0F2F1',
  '#B2DFDB',
  '#80CBC4',
  '#4DB6AC',
  '#26A69A',
  '#009688',
  '#00897B',
  '#00796B',
  '#00695C',
  '#004D40',
  '#A7FFEB',
  '#64FFDA',
  '#1DE9B6',
  '#00BFA5',
  '#4CAF50',
  '#E8F5E9',
  '#C8E6C9',
  '#A5D6A7',
  '#81C784',
  '#66BB6A',
  '#4CAF50',
  '#43A047',
  '#388E3C',
  '#2E7D32',
  '#1B5E20',
  '#B9F6CA',
  '#69F0AE',
  '#00E676',
  '#00C853',
  '#8BC34A',
  '#F1F8E9',
  '#DCEDC8',
  '#C5E1A5',
  '#AED581',
  '#9CCC65',
  '#8BC34A',
  '#7CB342',
  '#689F38',
  '#558B2F',
  '#33691E',
  '#CCFF90',
  '#B2FF59',
  '#76FF03',
  '#64DD17',
  '#CDDC39',
  '#F9FBE7',
  '#F0F4C3',
  '#E6EE9C',
  '#DCE775',
  '#D4E157',
  '#CDDC39',
  '#C0CA33',
  '#AFB42B',
  '#9E9D24',
  '#827717',
  '#F4FF81',
  '#EEFF41',
  '#C6FF00',
  '#AEEA00',
  '#FFEB3B',
  '#FFFDE7',
  '#FFF9C4',
  '#FFF59D',
  '#FFF176',
  '#FFEE58',
  '#FFEB3B',
  '#FDD835',
  '#FBC02D',
  '#F9A825',
  '#F57F17',
  '#FFFF8D',
  '#FFFF00',
  '#FFEA00',
  '#FFD600',
  '#FFC107',
  '#FFF8E1',
  '#FFECB3',
  '#FFE082',
  '#FFD54F',
  '#FFCA28',
  '#FFC107',
  '#FFB300',
  '#FFA000',
  '#FF8F00',
  '#FF6F00',
  '#FFE57F',
  '#FFD740',
  '#FFC400',
  '#FFAB00',
  '#FF9800',
  '#FFF3E0',
  '#FFE0B2',
  '#FFCC80',
  '#FFB74D',
  '#FFA726',
  '#FF9800',
  '#FB8C00',
  '#F57C00',
  '#EF6C00',
  '#E65100',
  '#FFD180',
  '#FFAB40',
  '#FF9100',
  '#FF6D00',
  '#FF5722',
  '#FBE9E7',
  '#FFCCBC',
  '#FFAB91',
  '#FF8A65',
  '#FF7043',
  '#FF5722',
  '#F4511E',
  '#E64A19',
  '#D84315',
  '#BF360C',
  '#FF9E80',
  '#FF6E40',
  '#FF3D00',
  '#DD2C00',
  '#795548',
  '#EFEBE9',
  '#D7CCC8',
  '#BCAAA4',
  '#A1887F',
  '#8D6E63',
  '#795548',
  '#6D4C41',
  '#5D4037',
  '#4E342E',
  '#3E2723',
  '#9E9E9E',
  '#FAFAFA',
  '#F5F5F5',
  '#EEEEEE',
  '#E0E0E0',
  '#BDBDBD',
  '#9E9E9E',
  '#757575',
  '#616161',
  '#424242',
  '#212121',
  '#607D8B',
  '#ECEFF1',
  '#CFD8DC',
  '#B0BEC5',
  '#90A4AE',
  '#78909C',
  '#607D8B',
  '#546E7A',
  '#455A64',
  '#37474F',
  '#263238',
  '#000000',
  '#FFFFFF',
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


function CustomizedLegend({payload, handleClick, data, meta}) {
  return (
    <ul style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none' }}>
      {
        payload.map((entry, index) => (
          <li
            key={`item-${entry.dataKey}`}
            onClick={() => handleClick(entry.dataKey)}
            style={{ marginLeft: '10px', color: entry.color }}
          >
            <input type="checkbox" id={index} name={index} checked={data && data[0][entry.dataKey] !== undefined}/>
            <label style={{ marginLeft: '5px' }} for={index}>{entry.value}: {meta && meta[entry.value].name} {meta && meta[entry.value].unit}</label>
          </li>
        ))
      }
    </ul>
  )
};

const getAxisYDomain = (from, to, ref, offset, data) => {
  const refData = data.slice(from, to);
  if (refData[0][ref] !== undefined) {
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d, i) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });
    return [bottom - offset, top + offset];
  } else return [0, 0];
};

const findMinMaxData = (start, end, data) => {
  let minMaxs = [];
  if (dataStart[0]) {
    minMaxs = Object.keys(data[0]).map(el => {
      if (el !== 'name') {
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

const [min, max] = findMinMaxData(dataStart[0].name, dataStart[dataStart.length - 1].name, dataStart);

const initialState = {
  data: dataStart,
  left: dataStart[0].name,
  right: dataStart[dataStart.length - 1].name,
  refAreaLeft: '',
  refAreaRight: '',
  top: max,
  bottom: min,
  animation: true,
  meta: null
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
  }

  componentDidMount(){
    axios.get('http://localhost:3001/records/5f26d1f3b0dbc533f9a0dac5')
      .then(res => {
        const { data, meta }= handelFile(res.data.data.file);
        const [min, max] = findMinMaxData(0, 200, data.slice(0, 200));
        dataStart = data;
        let newData = data;
        Object.keys(data[0]).forEach((item, i) => {
          if (i >= 5 && item !== 'name') {
            newData = newData.map(el => ({ ...el, [item]: undefined}));
          }
        });
        this.setState(() => ({ data: newData.slice(0, 200), top: max, bottom: min, left: 0, right: 200, meta }));
      }).catch(err => console.log(err));
  }

  zoom() {
    let { refAreaLeft, refAreaRight, data } = this.state;

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
    const [bottom, top] = findMinMaxData(refAreaLeft, refAreaRight, data);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
    }));
  }

  zoomOut() {
    const { data } = this.state;
    const [min, max] = findMinMaxData(data[0].name, data[data.length - 1].name, data);
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: data[0].name,
      right: data[data.length - 1].name,
      top: max,
      bottom: min,
    }));
  }

  handleClick(dataKey){
    const { data, left, right } = this.state;
    let newData = [];
    if (data[0] && data[0][dataKey] !== undefined) {
     newData = data.map(el => ({ ...el, [dataKey]: undefined}));
    } else {
      newData = data.map((el, i) => ({ ...el, [dataKey]: dataStart[i][dataKey]}));
    }
    const [min, max] = findMinMaxData(left, right, newData);
    this.setState(() => ({ data: newData, top: max, bottom: min}));
  }

  render() {
    const {
      data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, meta
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
          />
          <Tooltip />
          <Legend content={<CustomizedLegend handleClick={this.handleClick} data={data} meta={meta} />} />
          {
            Object.keys(data[0]).map((el, i) => {
              if(el !== 'name') {
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
