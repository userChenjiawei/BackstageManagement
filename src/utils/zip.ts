import { saveAs } from 'file-saver'
// import JSZip from 'jszip'
import JSZip = require('jszip');

export function exportTxt2Zip(th: any, jsonData: any ,txtName = 'file', zipName = 'file') {
  const zip = new JSZip()
  const data = jsonData
  let txtData = `${th}\r\n`
  data.forEach((r: { toString: () => string }) => {
    let tempStr = ''
    tempStr = r.toString()
    txtData += `${tempStr}\r\n`
  })
  zip.file(`${txtName}.txt`, txtData)
  zip.generateAsync({
    type: 'blob'
  }).then((blob: any) => {
    saveAs(blob, `${zipName}.zip`)
  }, () => {
    alert('Zip export failed:')
  })
}
