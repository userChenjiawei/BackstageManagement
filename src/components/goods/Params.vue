<template>
    <div>
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
 <el-alert
 :closable="false" show-icon
    title="注意:只允许为第三级分类设置相关参数"
    type="warning">
  </el-alert>
<el-card>
      <el-row>
      <el-col>
          <span>选择商品分类:</span>
          <el-cascader
    v-model="selectedOption"
    :options="cateList"
    @change="handleChangeSelectedOptions"
    :props="cascaderProp" clearable change-on-select></el-cascader>
      </el-col>
  </el-row>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many"><el-button type="primary" size="small" :disabled="isBtnDisabled" @click="showAddDialog">添加参数</el-button>
    <el-table :data="manyTableData" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
              <el-tag @close="handleCloseTag(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
              <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
            </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
<el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteParams(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only"><el-button type="primary" size="small" :disabled="isBtnDisabled" @click="showAddDialog">添加参数</el-button>
        <el-table :data="onlyTableData" border stripe>
                   <el-table-column type="expand">
          <template v-slot="scope">
              <el-tag @close="handleCloseTag(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
              <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref='saveTagInput'
  size="small"
  @keyup.enter="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
            </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
<el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteParams(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
<el-dialog @close="addDialogClose"
  :title="'添加'+textName"
  v-model="addDialogVisiable"
  width="50%">
  <el-form :model="addForm" :rules="addFromrules" ref="addFormRef" label-width="100px">
  <el-form-item :label="textName" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
  <span class="dialog-footer">
    <el-button @click="addDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="addParamsjieliu">确 定</el-button>
  </span>
  </template>
</el-dialog>
<el-dialog @close="editDialogClose"
  :title="'编辑'+textName"
  v-model="editDialogVisiable"
  width="50%">
  <el-form :model="editForm" :rules="editFromrules" ref="editFormRef" label-width="100px">
  <el-form-item :label="textName" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
  <span class="dialog-footer">
    <el-button @click="editDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editParamsjieliu">确 定</el-button>
  </span>
  </template>
</el-dialog>
    </div>
</template>
<script>
import { reactive, toRefs, ref} from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import {getCurrentInstance} from 'vue'

export default {
  setup () {
    let { proxy } = getCurrentInstance()

        // console.log(proxy)
        let saveTagInput = ref(null)
            onMounted(()=>{
      console.log(saveTagInput.value);
    })
    let params = reactive({
      cateList: [],
      cascaderProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedOption: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisiable: false,
      addForm: {},
      addFromrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editForm: {
        attr_id: '',
        attr_name: '',
        attr_sel: ''
      },
      editFromrules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisiable: false,
      async getCateList () {
      const { data: res } = await proxy.$http.get('categories')
      if (res.meta.status !== 200) return proxy.$message.error('获取商品分类失败')
      params.cateList = res.data
    },
    async getParamsData () {
      if (params.selectedOption.length !== 3) {
        params.selectedOption = []
        params.manyTableData = []
        params.onlyTableData = []
      }
      const { data: res } = await proxy.$http.get(`categories/${proxy.cateId}/attributes`,  { sel: proxy.activeName })
      if (res.meta.status !== 200) return proxy.$message.error('获取商品参数失败')
      res.data.forEach(item => {
        item.inputVisible = false
        item.inputValue = ''
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      if (params.activeName === 'many') {
        params.manyTableData = res.data
      } else {
        params.onlyTableData = res.data
      }
    },
    handleChangeSelectedOptions () {
      params.getParamsData()
    },
    handleTabClick () {
      params.getParamsData()
    },
    addParams () {
      proxy.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await proxy.$http.post(`categories/${proxy.cateId}/attributes`, { attr_name: proxy.addForm.attr_name, attr_sel: proxy.activeName })
        if (res.meta.status !== 201) return proxy.$message.error('添加参数失败')
        proxy.$message.success('添加参数成功')
        params.addDialogVisiable = false
        params.getParamsData()
      })
    },
    addDialogClose () {
      proxy.$refs.addFormRef.resetFields()
    },
    editDialogClose () {
      proxy.$refs.editFormRef.resetFields()
    },
    showAddDialog () {
      params.addDialogVisiable = true
    },
    async showEditDialog (id) {
      const { data: res } = await proxy.$http.get(`categories/${params.cateId}/attributes/${id}`, { attr_sel: params.activeName })
      if (res.meta.status !== 200) return proxy.$message.error('查询参数失败')
      proxy.$message.success('查询参数成功')
      params.editForm = res.data
      params.editDialogVisiable = true
    },
    editParams () {
      proxy.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await proxy.$http.put(`categories/${params.cateId}/attributes/${params.editForm.attr_id}`, { attr_name: params.editForm.attr_name, attr_sel: params.activeName })
        if (res.meta.status !== 200) return proxy.$message.error('编辑参数失败')
        proxy.$message.success('编辑参数成功')
        params.editDialogVisiable = false
        params.getParamsData()
      })
    },
    async deleteParams (id) {
      const confirmResult = await proxy.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        proxy.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (confirmResult === 'confirm') {
        const { data: res } = await proxy.$http.delete(`categories/${params.cateId}/attributes/${id}`)
        if (res.meta.status !== 200) {
          proxy.$message.error('删除参数失败')
        }
        proxy.$message.success('删除参数成功')
        params.getParamsData()
      }
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        params.saveAttrVals(row)
      }
    },
    async saveAttrVals (row) {
      const { data: res } = await proxy.$http.put(`categories/${params.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) {
        proxy.$message.error('添加属性失败')
        // row.attr_vals.pop()
      } else {
        proxy.$message.success('添加属性成功')
      }
    },
    showInput (scope) {
      scope.row.inputVisible = true
      // 虽然input的visiable已经是true了，但是还没有被渲染出来，这时候通过ref是找不到的，所以将回调中的代码放在外面是不行的，在页面渲染后肯定会调用nexttick，所以就能找到了
      proxy.$nextTick(() => {
         console.log(this,proxy);
         console.log(saveTagInput);
        saveTagInput.$refs.input.focus()
      })
    },
    handleCloseTag (i, row) {
      row.attr_vals.splice(i, 1)
      params.saveAttrVals(row)
    },
    })
    params.isBtnDisabled = computed(()=>{
      if (params.selectedOption.length > 0) {
        return false
      } return true
    }),
     params.cateId =computed(()=>{
      if (params.selectedOption.length === 3) {
        return proxy.selectedOption[2]
      } return null
    }),
    params.textName = computed(()=>{
      if (params.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }),
    params.addParamsjieliu = computed(()=>{
     return  proxy.$jieliu(params.addParams,2000)
    }),
    params.editParamsjieliu = computed(()=>{
     return  proxy.$jieliu(params.editParams,2000)
    })
    return {
      ...toRefs(params),
      saveTagInput
    }
  },
  created () {
    this.getCateList()
  },
  
}
</script>
<style lang="less" scoped>
.el-alert{
    margin-bottom: 20px;
}
.el-tabs{
    margin-top: 20px;
}
.el-tag{
  margin: 5px;
}
.input-new-tag{
  width: 120px;
}
</style>
