<template>
  <div>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row>
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">

  </el-input>
        </el-col>
    </el-row>
    <el-table border stripe :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" ></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column  label="是否付款">
            <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
                      <template v-slot="scope">
            <span>{{timeToStandard(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <el-button type="primary" size="small" @click="showEditDialog">编辑</el-button>
            <el-button type="success" size="small" @click="showProgressDialog">物流</el-button>
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
<el-dialog @close="editDialogClose"
  title="编辑地址"
  v-model="editDialogVisiable"
  width="50%">
  <el-form :model="addressForm" :rules="editFromrules" ref="editFormRef" label-width="80px">
  <el-form-item label="省市区县" prop="address1" >
      <el-cascader :options="cityData" v-model="addressForm.address1" class="wid"></el-cascader>
  </el-form-item>
    <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
  <span class="dialog-footer">
    <el-button @click="editDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editAddressjieliu">确 定</el-button>
  </span>
  </template>
</el-dialog>
<el-dialog
  title="物流进度"
  v-model="ProgressDialogVisible"
  width="50%">
      <el-radio-group v-model="reverse">
      <el-radio :label="true">倒序</el-radio>
      <el-radio :label="false">正序</el-radio>
    </el-radio-group>
   <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import cityData from './citydata.js'
import {getCurrentInstance,watch,computed} from 'vue'
export default {
  setup () {
    let { proxy } = getCurrentInstance()
    let order = reactive({
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      timeid:null,
      orderList: [],
      total: 0,
      editDialogVisiable: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      editFromrules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityData: cityData,
      ProgressDialogVisible: false,
      progressInfo: [],
      reverse: true,
      async getOrderList () {
      const { data: res } = await proxy.$http.get('orders',order.queryInfo)
      if (res.meta.status !== 200) return proxy.$message.error('获取订单列表失败')
      order.orderList = res.data.goods
      order.total = res.data.total
    },
    timeToStandard (val) {
      return proxy.$moment(val).format('YYYY年MM月DD日 HH时mm分ss秒')
    },
    handleSizeChange (val) {
      order.queryInfo.pagesize = val
      order.getOrderList()
    },
    handleCurrentChange (val) {
      order.queryInfo.pagenum = val
      order.getOrderList()
    },
    editDialogClose () {
      proxy.$refs.editFormRef.resetFields()
    },
    showEditDialog () {
      order.editDialogVisiable = true
    },
    editAddress () {
      order.editDialogVisiable = false
    },
    async showProgressDialog () {
      const { data: res } = await proxy.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return proxy.$message.error('获取物流进度失败')
      order.progressInfo = res.data
      order.ProgressDialogVisible = true
    }
    })
        watch(()=>order.queryInfo.query,()=>{
     proxy.timeid = proxy.$fangdou(proxy.getOrderList,500,proxy.timeid)
    }), //监测inpute的变化，触发响应函数，做防抖处理，需要timeid返回赋值
    order.editAddressjieliu = computed(()=>{
      return proxy.$jieliu(order.editAddress,2000)
    })
    return {
      ...toRefs(order)
    }
  },
  created () {
    this.getOrderList()
  }

}
</script>

<style scoped lang="less">
.wid {
    width: 100%;
}
.el-radio-group{
    margin-bottom: 20px;
}
</style>
