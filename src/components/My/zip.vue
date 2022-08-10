<template>
  <div class="app-container">
    <el-input
      v-model="filename"
      placeholder="Please enter the file name (default file)"
      style="width:300px;"
      prefix-icon="el-icon-document"
    />
    <el-button
      style="margin-left:20px;"
      type="primary"
      @click="handleDownload"
    >
      Export Zip
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="name"
      >
        <template v-slot="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="apple">
        <template v-slot="scope">
          {{ scope.row.apple }}
        </template>
      </el-table-column>
      <el-table-column
        label="banana"
        align="center"
      >
        <template v-slot="scope">
          <el-tag>{{ scope.row.banana }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="orange"
        align="center"
      >
        <template v-slot="scope">
          {{ scope.row.orange }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatJson } from '../../utils/index.ts'
import { exportTxt2Zip } from '../../utils/zip.ts'
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance} from 'vue'

export default {
  setup(){
    let { proxy } = getCurrentInstance()
    let zip = reactive({
         list: [ {
      name: 'fruit-1',
      apple: 'apple-10',
      banana: 'banana-10',
      orange: 'orange-10'
    },
    {
      name: 'fruit-2',
      apple: 'apple-20',
      banana: 'banana-20',
      orange: 'orange-20'
    }],
        //  listLoading :true,
         downloadLoading :false,
         filename :'',
          handleDownload() {
            console.log('111');
    proxy.downloadLoading = true
    const tHeader = ['name', 'apple', 'banana', 'orange']
    const filterVal = ['name', 'apple', 'banana', 'orange']
    const list = proxy.list
    const data = formatJson(filterVal, list)
    if (proxy.filename !== '') {
      exportTxt2Zip(tHeader, data, proxy.filename, proxy.filename)
    } else {
      exportTxt2Zip(tHeader, data)
    }
    proxy.downloadLoading = false
    console.log('222');
  }
    })
    return {...toRefs(zip)}
  }
}
</script>
<style lang="less">

</style>
