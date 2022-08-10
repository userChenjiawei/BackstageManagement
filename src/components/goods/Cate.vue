<template>
    <div>
         <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
    </el-row>
    <!-- <tree-Table :data="goodsList" :columns="columns" :selection-type="false" :expand-type="false" show-index stripe border class="top">
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===true" style="color: rightgreen"></i>
            <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="paixu" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag v-else>三级</el-tag>
        </template>
        <template slot="caozuo" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateNameDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteFenLei(scope.row)">删除</el-button>
        </template>
    </tree-Table> -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog @close="addCateDialogClose"
  title="添加分类"
  v-model="addCatesDialogVisiable"
  width="50%">
  <el-form :model="addCateForm" ref="addCateFormRef" label-width="80px" :rules="addCateFromrules">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
    <el-form-item label="父级分类">
         <el-cascader
    v-model="selectedOption"
    :options="parentCateList"
    @change="handleChangeSelectedOptions"
    :props="cascaderProp" clearable change-on-select></el-cascader>
  </el-form-item>
  </el-form>
  <template #footer>
  <span class="dialog-footer">
    <el-button @click="addCatesDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="addCateInfo">确 定</el-button>
  </span>
  </template>
</el-dialog>
<el-dialog @close="editDialogClose"
  title="编辑"
  v-model="editDialogVisiable"
  width="70%">
  <el-form :model="editForm" :rules="editFromrules" ref="editFormRef" label-width="80px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
    <template #footer>
  <span class="dialog-footer">
    <el-button @click="editDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editCateInfo">确 定</el-button>
  </span>
    </template>
</el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance} from 'vue'
export default {
  setup () {
    let { proxy } = getCurrentInstance()
    let cate = reactive({
      goodsList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 1
      },
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'paixu'
      },
      {
        label: '操作',
        type: 'template',
        template: 'caozuo'
      }
      ],
      addCatesDialogVisiable: false,
      addCateForm: {
        cat_pid: '0',
        cat_name: '',
        cat_level: '0'
      },
      addCateFromrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editFromrules: {
        cat_name: [
          { required: true, message: '请修改分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedOption: [],
      editDialogVisiable: false,
      editForm: {
        cat_name: '',
        cat_id: ''
      },
      async getGoodsList () {
      const { data: res } = await proxy.$http.get('categories',  cate.queryInfo )
      if (res.meta.status !== 200) return proxy.$message.error('获取商品分类数据列表失败')
      cate.goodsList = res.data.result
      cate.total = res.data.total
    },
    handleSizeChange (val) {
      cate.queryInfo.pagesize = val
      cate.getGoodsList()
    },
    handleCurrentChange (val) {
      cate.queryInfo.pagenum = val
      cate.getGoodsList()
    },
    showAddCateDialog () {
      cate.getParentCateList()
      cate.addCatesDialogVisiable = true
    },
    async getParentCateList () {
      const { data: res } = await proxy.$http.get('categories', { type: 2 })
      if (res.meta.status !== 200) return proxy.$message.error('获取父级分类失败')
      proxy.$message.success('获取父级分类成功')
      cate.parentCateList = res.data
    },
    handleChangeSelectedOptions () {
      if (cate.selectedOption.length > 0) {
        cate.addCateForm.cat_pid = cate.selectedOption[cate.selectedOption.length - 1]
        cate.addCateForm.cat_level = cate.selectedOption.length
      } else {
        cate.addCateForm.cat_pid = 0
        cate.addCateForm.cat_level = 0
      }
    },
    addCateDialogClose () {
      proxy.$refs.addCateFormRef.resetFields()
      cate.selectedOption = []
      cate.addCateForm.cat_pid = 0
      cate.addCateForm.cat_level = 0
    },
    async addCateInfo () {
      proxy.$refs.addCateFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await proxy.$http.post('categories', cate.addCateForm)
        if (res.meta.status !== 201) return proxy.$message.error('添加分类失败')
        proxy.$message.success('添加分类成功')
        cate.addCatesDialogVisiable = false
        cate.getGoodsList()
      })
    },
    showEditCateNameDialog (row) {
      cate.editForm.cat_name = row.cat_name
      cate.editForm.cat_id = row.cat_id
      cate.editDialogVisiable = true
    },
    editDialogClose () { proxy.$refs.editFormRef.resetFields() },
    async editCateInfo () {
      proxy.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await proxy.$http.put(`categories/${cate.editForm.cat_id}`, { cat_name: cate.editForm.cat_name })
        if (res.meta.status !== 200) return proxy.$message.error('编辑分类失败')
        proxy.$message.success('编辑分类成功')
        cate.editDialogVisiable = false
        cate.getGoodsList()
      })
    },
    async deleteFenLei (row) {
      const confirmResult = await proxy.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
        const { data: res } = await proxy.$http.delete('categories/' + row.id)
        if (res.meta.status !== 200) {
          proxy.$message.error('删除分类失败')
        }
        proxy.$message.success('删除分类成功')
        // 因为这个delete请求没有返回被删除后剩余的数据，因此无法在页面不更新或重新发送请求的前提下删除
        cate.getGoodsList()
      }
    }
    })
    return {
      ...toRefs(cate)
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.top{
    margin-top: 20px;
}
.el-cascader{
    width: 100%;
}
</style>
