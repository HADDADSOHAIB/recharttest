import React, { useEffect, useState } from 'react';
import axios from 'axios';
import handelFile from './handleFile';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceArea
} from 'recharts';

function CustomizedLegend({payload, handleClick}) {
  // useEffect(() => {
  //   console.log(payload)
  //   return () => '';
  // }, [payload]);
  return (
    <ul style={{ display: 'flex', listStyle: 'none' }}>
      {
        payload.map((entry, index) => (
          <li
            key={`item-${entry.dataKey}`}
            onClick={() => handleClick(entry.dataKey)}
            style={{ margin: '10px', color: entry.color }}
          >
            {entry.value}
          </li>
        ))
      }
    </ul>
  )
};

function App() {
  const [data, setData] = useState(null);
  const [datat, setDatat] = useState([
    {
      "name": "Page A",
      "uv": 4000,
      "pv": 2400,
      "amt": 2400
    },
    {
      "name": "Page B",
      "uv": 3000,
      "pv": 1398,
      "amt": 2210
    },
    {
      "name": "Page C",
      "uv": 2000,
      "pv": 9800,
      "amt": 2290
    },
    {
      "name": "Page D",
      "uv": 2780,
      "pv": 3908,
      "amt": 2000
    },
    {
      "name": "Page E",
      "uv": 1890,
      "pv": 4800,
      "amt": 2181
    },
    {
      "name": "Page F",
      "uv": 2390,
      "pv": 3800,
      "amt": 2500
    },
    {
      "name": "Page G",
      "uv": 3490,
      "pv": 4300,
      "amt": 2100
    }
  ]);

  const datatt = [
    {
      "name": "Page A",
      "uv": 4000,
      "pv": 2400,
      "amt": 2400
    },
    {
      "name": "Page B",
      "uv": 3000,
      "pv": 1398,
      "amt": 2210
    },
    {
      "name": "Page C",
      "uv": 2000,
      "pv": 9800,
      "amt": 2290
    },
    {
      "name": "Page D",
      "uv": 2780,
      "pv": 3908,
      "amt": 2000
    },
    {
      "name": "Page E",
      "uv": 1890,
      "pv": 4800,
      "amt": 2181
    },
    {
      "name": "Page F",
      "uv": 2390,
      "pv": 3800,
      "amt": 2500
    },
    {
      "name": "Page G",
      "uv": 3490,
      "pv": 4300,
      "amt": 2100
    }
  ];

  const [state, setState] = useState({
    data: datat,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    top2: 'dataMax+20',
    bottom2: 'dataMin-20',
    animation: true,
  });

  const getAxisYDomain = (from, to, ref, offset) => {
    const refData = data.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });
  
    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  const zoom = () => {
    let { refAreaLeft, refAreaRight, data } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setState({
        ...state,
        refAreaLeft: '',
        refAreaRight: '',
      });
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, 'cost', 1);
    const [bottom2, top2] = getAxisYDomain(refAreaLeft, refAreaRight, 'impression', 50);

    setState({
      ...state,
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
      bottom2,
      top2,
    });
  }

  const zoomOut = () => {
    const { data } = state;
    setState({
      ...state,
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+1',
      bottom: 'dataMin',
      top2: 'dataMax+50',
      bottom2: 'dataMin+50',
    });
  }
  useEffect(() => {
    // axios.get('http://localhost:3001/records/5f26d1f3b0dbc533f9a0dac5')
    //   .then(res => setData(handelFile(res.data.data.file))).catch(err => console.log(err));
    return () => '';
  }, []);

  useEffect(() => {
    console.log(data);
    return () => '';
  }, [data]);

  const handleClick = dataKey => {
    if (datat[0] && datat[0][dataKey]) {
      setDatat(datat.map(el => ({ ...el, [dataKey]: undefined})));
    } else {
      setDatat(datat.map((el, i) => ({ ...el, [dataKey]: datatt[i][dataKey]})));
    }
  }

  return (
    <LineChart
      width={730}
      height={500}
      data={datat}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      onMouseDown={e => setState({ ...state, refAreaLeft: e.activeLabel })}
      onMouseMove={e => state.refAreaLeft && setState({ ...state, refAreaRight: e.activeLabel })}
      onMouseUp={zoom}
      >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        allowDataOverflow
        domain={[state.left, state.right]}
        />
      <YAxis
        allowDataOverflow
        domain={[state.bottom, state.top]}
        />
      <Tooltip />
      <Legend content={<CustomizedLegend handleClick={handleClick} />} />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      <Line type="monotone" dataKey="amt" stroke="#82ca0d" />
      
    </LineChart>
  );
}

export default App;
