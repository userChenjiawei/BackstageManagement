<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal" >
        <el-checkbox label="apple">
          apple
        </el-checkbox>
        <el-checkbox label="banana">
          banana
        </el-checkbox>
        <el-checkbox label="orange">
          orange
        </el-checkbox>
      </el-checkbox-group>
    </div>
      <!-- 因为这是动态表格，每次表格都不一样，所以键值必须每次不同因此++ -->
    <el-table
      :key="key"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="fruitName"
      />
      <template v-if="formThead.length!==0">
      <el-table-column
        v-for="fruit in formThead"
        :key="fruit"
        :label="fruit"
      >
        <template v-slot='scope'>
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance, watch, ref } from 'vue'


export default {
  setup() {
    let defaultFormThead = ['apple', 'banana']
    let { proxy } = getCurrentInstance()
    let checkboxVal = ref(defaultFormThead)
    let table = reactive({  
         tableData: [
    {
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
    }
          ],
         key: 1, // Table key,
         formTheadOptions: ['apple', 'banana', 'orange'],
         formThead: defaultFormThead, // Default header,
// @change="onCheckboxValChange" 这个会有bug
    //   onCheckboxValChange(value) {
    //     console.log(value,'@');
    // table.formThead = table.formTheadOptions.filter(i => value.indexOf(i) >= 0)
    // console.log(table.formThead,'table.formThead');
    // table.key = table.key + 1 // Ensure the table will be re-rendered each time
    // console.log(table.key,'key');
// }

    },
    watch(checkboxVal,(newValue,oldValue)=>{
      // table.formThead = table.formTheadOptions.filter(i => newValue.indexOf(i) >= 0)
      // console.log(table.formThead);
      // if(table.formThead.length===0){
      //   table.formThead=[]
      // }
			table.formThead=checkboxVal
            console.log(table.formThead.length);

    table.key = table.key + 1 // Ensure the table will be re-rendered each time
			})
   
    )
    return {...toRefs(table),checkboxVal}
  }



  
}
</script>
