<template>
  <div>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
    <el-card>
        <el-alert
     center
    title="添加商品信息"
    type="info"
    show-icon>
  </el-alert>
  <el-steps :space="200" :active="activeStep - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<el-form :model="addForm" :rules="addrules" ref="addruleFormref" label-width="100px" label-position="top">
 <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTabLeave" @tab-click="tabClicked" >
    <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
    v-model="addForm.goods_cat"
    :options="cateList"
    @change="handleChange"
    :props="cascaderProp" clearable change-on-select></el-cascader>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
  </el-checkbox-group>
             </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
        <el-upload
  :action="uploadURL"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture"
  :on-success="handlePicSuccess"
  :headers="headerObj">
  <el-button size="small" type="primary">点击上传</el-button>
  <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
        <!-- <quill-editor
    ref="myQuillEditor"
    v-model="addForm.goods_introduce"
  /> -->
  <el-button type="primary" class="aa" @click="addjieliu">添加商品</el-button>
    </el-tab-pane>
</el-tabs>
</el-form>
    </el-card>
    <el-dialog
  title="图片预览"
  v-model="picDialogVisible"
  width="30%"
 >
<img :src="previewPath" class="previewImg">
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { reactive, toRefs } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import {getCurrentInstance} from 'vue'
export default {
  setup () {
    let { proxy } = getCurrentInstance()
    let add = reactive({
      activeStep: '0',
      addForm: {
        goods_name: '',
        goods_weight: '',
        goods_price: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cascaderProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      picDialogVisible: false,
       async getCateList () {
      const { data: res } = await proxy.$http.get('categories')
      if (res.meta.status !== 200) return proxy.$message.error('获取商品分类失败')
      add.cateList = res.data
    },
    handleChange () {
      if (add.addForm.goods_cat.length !== 3) {
        add.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (add.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
        proxy.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked () {
      if (add.activeStep === '1') {
        const { data: res } = await proxy.$http.get(`categories/${add.cateId}/attributes`, { sel: 'many' } )
        if (res.meta.status !== 200) return proxy.$message.error('获取商品参数失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        add.manyTableData = res.data
      } else if (add.activeStep === '2') {
        const { data: res } = await proxy.$http.get(`categories/${add.cateId}/attributes`,  { sel: 'only' })
        if (res.meta.status !== 200) return proxy.$message.error('获取商品属性失败')
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        // })
        add.onlyTableData = res.data
      }
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = add.addForm.pics.findIndex(x =>
        x.pic === filePath
      )
      add.addForm.pics.splice(i, 1)
    },
    handlePreview (file) {
      add.previewPath = file.response.data.url
      add.picDialogVisible = true
    },
    handlePicSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      add.addForm.pics.push(picInfo)
    },
    add () {
      proxy.$refs.addruleFormref.validate(async vaild => {
        if (!vaild) { return proxy.$message.error('请填写必要的项') }
        const form = _.cloneDeep(add.addForm)
        form.goods_cat = form.goods_cat.join(',')
        add.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(newInfo)
        })
        add.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(newInfo)
        })
        const { data: res } = await proxy.$http.post('goods', form)
        if (res.meta.status !== 201) return proxy.$message.error('添加商品失败')
        proxy.$message.success('添加商品成功')
        proxy.$router.push('/goods')
      })
    }

    })
    add.cateId = computed(()=>{
      if (add.addForm.goods_cat.length === 3) {
        return add.addForm.goods_cat[add.addForm.goods_cat.length - 1]
      }
      return null
    }),
   add.addjieliu = computed(()=>{
     return  proxy.$jieliu(add.add,2000) 
  })
    return {
      ...toRefs(add)
    }
  },
  created () {
    this.getCateList()
  },
}
</script>

<style scoped lang="less">
    .el-steps{
        margin: 20px 0 20px 80px;
    }
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .previewImg{
        width: 100%;
    }
    .aa{
        margin-top: 15px;
    }
</style>
