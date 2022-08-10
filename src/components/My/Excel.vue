<template>
  <div class="app-container">
    <UploadExcelComponent
      :onSuccess="handleSuccess"
      :beforeUpload="beforeUpload"
    />
    <el-table
    :key='key'
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
          <!-- <el-table-column
        prop="name"
        label="fruitName"
      /> -->
      <el-table-column
        v-for="item in tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      >
              <template v-slot='scope'>
          {{ scope.row[item]}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '../My/UploadExcel/index.vue'
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance, ref } from 'vue'
export default{
    components: {
    UploadExcelComponent
  },
  setup() {
    let { proxy } = getCurrentInstance()
    // let tableData1= []
    let key1 = new Date()
    let key = ref(key1)
    // let tableData= ref(tableData1)
    let excelll = reactive({
     tableData: [],
        tableHeader:[],
        beforeUpload(file) {
          const isLt1M = file.size / 1024 / 1024 < 1
          if (isLt1M) {
              return true
          }
          proxy.$message({
              message: 'Please do not upload files larger than 1m in size.',
             type: 'warning'
          })
          return false
        }
      //   handleSuccess(results, header) {
      // excelll.key= new Date()
      //       excelll.tableData = results
      //       console.log(excelll.tableData,'handleSuccess');
      //       excelll.tableHeader = header
      //       console.log(excelll.tableHeader,'handleSuccess');
      //   }
        })
        return {
         ...toRefs(excelll),key
        }
  },

  methods:{
    // 这个通过子组件传递参数给父组件，似乎必须放在methods中，放在setup中界面就不刷新就有bug 原理不清楚
      handleSuccess(results, header) {
        this.key= new Date()
            this.tableData = results
            console.log(  this.tableData,'handleSuccess');
              this.tableHeader = header
            console.log(  this.tableHeader,'handleSuccess');
        }
    //   aa(){
    //             this.key= new Date()

    //     this.tableData= [
    // {
    //   name: 'fruit-1',
    //   apple: 'apple-10',
    //   banana: 'banana-10',
    //   orange: 'orange-10'
    // },
    // {
    //   name: 'fruit-2',
    //   apple: 'apple-20',
    //   banana: 'banana-20',
    //   orange: 'orange-20'
    // },
    //     {
    //   name: 'fruit-3',
    //   apple: 'apple-20',
    //   banana: 'banana-20',
    //   orange: 'orange-20'
    // }
    //       ]
    //   }
  }
}
</script>
