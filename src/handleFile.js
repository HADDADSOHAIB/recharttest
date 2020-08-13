/* eslint-disable no-loop-func */
const handelFile = file => {
  const array = file.split("\n");
  const index = array.findIndex(el => el === "[Channel Information]\r");
  const ids = array[index + 1].split(",").map(el => parseInt(el, 10));
  const names = array[index + 2].split(",");
  const units = array[index + 3].split(",");

  const data = [];

  // for(let i=1; i < ids.length; i++){
  //   data[ids[i]] = { set: [], unit: units[i], name: names[i]};
  // }

  let j = 0;

  while(array[index + 6 + j]){
    const dataLine = array[index + 6 + j].split(',');
    let lineObject = { name: j};
    for(let i = 1; i < ids.length; i++) {
      lineObject = { ...lineObject, [ids[i]]: parseInt(dataLine[i])}
    }
    data.push(lineObject);
    j += 1;
  }

  let meta = {};
  for(let i = 1; i < ids.length; i++) {
    meta = { ...meta, [ids[i]]: { name: names[i], unit: units[i]}}
  }
  return { data, meta };
}

export default handelFile;