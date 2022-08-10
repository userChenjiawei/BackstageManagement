<template>
  <div>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row :gutter="20">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
  </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
    </el-row>
    <el-table border stripe :data="goodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
          <template v-slot="scope">
            <span>{{timeToStandard(scope.row.add_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance,watch} from 'vue'
export default {
 setup () {  
   let { proxy } = getCurrentInstance()
   let list = reactive({
      goodsList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 5,
        pagesize: 5
      },
      timeid: null,
      async getGoodsList () {
      const { data: res } = await proxy.$http.get('goods', proxy.queryInfo)
      if (res.meta.status !== 200) { return proxy.$message.error('获取商品列表失败') }
      proxy.goodsList = res.data.goods
      proxy.total = res.data.total
    },
    addgoods () {
      proxy.$router.push('/goods/add')
    },
    handleSizeChange (val) {
      proxy.queryInfo.pagesize = val
      proxy.getGoodsList()
    },
    handleCurrentChange (val) {
      proxy.queryInfo.pagenum = val
      proxy.getGoodsList()
    },
    timeToStandard (val) {
      return proxy.$moment(val).format('YYYY年MM月DD日 HH时mm分ss秒')
    },
    async deleteGoods (id) {
      const confirmResult = await proxy.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
        const { data: res } = await proxy.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          proxy.$message.error('删除商品失败')
        }
        proxy.$message.success('删除商品成功')
        proxy.getGoodsList()
      }
    }
   })
    watch(()=>list.queryInfo.query,()=>{
     proxy.timeid = proxy.$fangdou(proxy.getGoodsList,500,proxy.timeid)
    }) //监测inpute的变化，触发响应函数，做防抖处理，需要timeid返回赋值
    return {
     ...toRefs(list)
    }
  },
  created () {
    this.getGoodsList()
  },

  components: {

  }
}
</script>

<style scoped lang="less">

</style>
