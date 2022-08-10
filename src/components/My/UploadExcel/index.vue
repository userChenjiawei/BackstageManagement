<template>
  <div>
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    >
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      Drop excel file here or
      <el-button
        :loading="loading"
        style="margin-left:16px;"
        type="primary"
        @click="handleUpload"
        :icon="Edit"
      >
        Browse
      </el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance } from 'vue'

import XLSX from './index.ts'
export default{
		props:['onSuccess','beforeUpload'],
  setup(props,context) {
    // console.log(props,'props')
    // console.log(context,'context')
    // console.log(props.onSuccess);
     console.log(props.beforeUpload);

     let { proxy } = getCurrentInstance()
     let loadExcel = reactive({
     loading : false,
      excelData : {
        header: null,
        results: null
  },
   generateData(header, results) {
    loadExcel.excelData.header = header
    loadExcel.excelData.results = results
    console.log(results,'results');
    props.onSuccess && props.onSuccess(loadExcel.excelData.results,loadExcel.excelData.header)
    setTimeout(() => {
            loadExcel.loading = false
      console.log('loading结束');
    }, 10000);

  },
   handleDrop(e) {
    e.stopPropagation()
    e.preventDefault()
    if (loadExcel.loading) return
    if (!e.dataTransfer) return
    const files = e.dataTransfer.files
    if (files.length !== 1) {
      proxy.$message.error('Only support uploading one file!')
      return
    }
    const rawFile = files[0] // only use files[0]

    if (!loadExcel.isExcel(rawFile)) {
      proxy.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
      return false
    }
    loadExcel.upload(rawFile)
    e.stopPropagation()
    e.preventDefault()
  },
   handleDragover(e) {
    e.stopPropagation()
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
  },
   handleUpload() {
    (proxy.$refs['excel-upload-input']).click()
    console.log('woanle');
  },
   handleClick(e) {
    const files = (e.target).files
    if (files) {
      const rawFile = files[0] // only use files[0]
      console.log('jiazaizhong');
      loadExcel.upload(rawFile)
    }
  },
   upload(rawFile) {
    (proxy.$refs['excel-upload-input']).value = '' // Fixes can't select the same excel
    if (!props.beforeUpload) {
      loadExcel.readerData(rawFile)
      console.log('sss');
      return
    }
    const before = props.beforeUpload(rawFile)
    console.log(before);
    if (before) {
      loadExcel.readerData(rawFile)
      console.log("readok");
    }
  },
   readerData(rawFile) {
           console.log('loading开始');
    loadExcel.loading = true
    const reader = new FileReader()
    reader.onload = e => {
      const data = (e.target).result
      console.log(data);
      const workbook = XLSX.read(data, { type: 'array' })
      console.log(workbook,'workbook');
      const firstSheetName = workbook.SheetNames[0]
      console.log(firstSheetName,'firstSheetName');
      const worksheet = workbook.Sheets[firstSheetName]
            console.log(worksheet,'worksheet');

      const header = loadExcel.getHeaderRow(worksheet)
      const results = XLSX.utils.sheet_to_json(worksheet)
      loadExcel.generateData(header, results)

    }
    reader.readAsArrayBuffer(rawFile)
  },
   getHeaderRow(sheet) {
    const headers= []
    const range = XLSX.utils.decode_range(sheet['!ref'])
    console.log(range,'range');
    const R = range.s.r
    // start in the first row
    for (let C = range.s.c; C <= range.e.c; ++C) { // walk every column in the range
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
      // find the cell in the first row
      let hdr = ''
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
      if (hdr === '') {
        hdr = 'UNKNOWN ' + C // replace with your desired default
      }
      headers.push(hdr)
    }
    console.log(headers,'headers');
    return headers
  },
   isExcel(file) {
    return /\.(xlsx|xls|csv)$/.test(file.name)
  }
   })
   return {...toRefs(loadExcel)}
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
