<template>
<div>
        <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="authName" label="权限名称"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template v-slot="scope">
                    <el-tag type="success" v-if="scope.row.level==='0'">一级</el-tag>
                    <el-tag type="info" v-else-if="scope.row.level==='1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>

</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance} from 'vue'
export default {
  setup () {
    let { proxy } = getCurrentInstance()
    let rights = reactive({
      rightsList: [],
      async getRightsList () {
        const { data: res } = await proxy.$http.get('rights/list')
        if (res.meta.status !== 200) return proxy.$message.error('获取用户权限失败')
        proxy.$message.success('获取用户权限成功')
        proxy.rightsList = res.data
    }
    })
    return {
      ...toRefs(rights)
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style lang="les">
</style>
