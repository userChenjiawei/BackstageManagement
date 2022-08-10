<template>
    <div>
            <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row>
        <el-col :span="4">
            <el-button type="primary" @click="addRolesDialogVisiable = true">添加角色</el-button>
        </el-col>
            </el-row>
        <el-table :data="RolesList" border stripe>
            <el-table-column type="expand">
                <template v-slot="scope">
                    <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="[i1 === 0 ? 'top' : '','bottom', 'vcenter']">
                        <el-col :span="5"><el-tag @close="deleteRights(scope.row,item1.id)" closable>{{item1.authName}}</el-tag><i class="el-icon-caret-right"></i>
</el-col>
                        <el-col :span="19">
                            <el-row v-for="(item2) in item1.children" :key="item2.id" :class="['vcenter']">
                                <el-col :span="8"><el-tag @close="deleteRights(scope.row,item2.id)" type="success" closable>{{item2.authName}}</el-tag><i class="el-icon-caret-right"></i>
</el-col>
                                <el-col :span="16">
                                    <el-row>
                                       <el-tag closable type="warning" v-for="(item3) in item2.children" :key="item3.id" @close="deleteRights(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template v-slot="scope">
                  <el-button type="primary"  size="small" @click="editRoleForm(scope.row.id)">编辑</el-button>
                  <el-button type="danger"  size="small" @click="deleteRole(scope.row.id)">删除</el-button>
                  <el-button type="warning"  size="small" @click="showRightDialogSetting(scope.row)">分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>
</el-card>
<el-dialog @close="addRoleDialogClose"
  title="提示"
  v-model="addRolesDialogVisiable"
  width="30%">
  <el-form :model="addRoleForm" ref="addRoleFormRef" label-width="70px">
  <el-form-item label="角色名称">
    <el-input v-model="addRoleForm.roleName"></el-input>
  </el-form-item>
    <el-form-item label="角色描述">
    <el-input v-model="addRoleForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
  <span class="dialog-footer">
    <el-button @click="addRolesDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="addRoleInfojieliu">确 定</el-button>
  </span>
  </template>
</el-dialog>
<el-dialog @close="editRoleDialogClose"
  title="提示"
  v-model="editRolesDialogVisiable"
  width="30%">
  <el-form :model="editRolesForm" ref="editRoleFormRef" label-width="70px">
        <el-form-item label="角色ID">
    <el-input v-model="editRolesForm.roleId" disabled></el-input>
  </el-form-item>
  <el-form-item label="角色名称">
    <el-input v-model="editRolesForm.roleName"></el-input>
  </el-form-item>
    <el-form-item label="角色描述">
    <el-input v-model="editRolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <template #footer>
  <span class="dialog-footer">
    <el-button @click="editRolesDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfojieliu">确 定</el-button>
  </span>
  </template>
</el-dialog>
<el-dialog @close="rightDialogClose"
  title="提示"
  v-model="showRightsDialogVisiable"
  width="30%">
  <el-tree ref="treeRef" :data="rightsList" :props="rightProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys"></el-tree>
  <template #footer>
  <span  class="dialog-footer">
    <el-button @click="showRightsDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="allowRightsjieliu">确 定</el-button>
  </span>
  </template>
</el-dialog>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import {getCurrentInstance,computed} from 'vue'
export default {
  setup () {
    let { proxy } = getCurrentInstance()
    let roles = reactive({
      RolesList: [],
      addRolesDialogVisiable: false,
      addRoleForm: {},
      editRolesForm: {},
      editRolesDialogVisiable: false,
      showRightsDialogVisiable: false,
      rightsList: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      defkeys: [],
      roleid: '',
       async getRolesList () {
      const { data: res } = await proxy.$http.get('roles')
      if (res.meta.status !== 200) return proxy.$message.error('获取角色列表失败')
      proxy.$message.success('获取角色列表成功')
      proxy.RolesList = res.data
    },
    addRoleDialogClose () {
      proxy.$refs.addRoleFormRef.resetFields()
    },
    addRoleInfo () {
      proxy.$refs.addRoleFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await proxy.$http.post('roles', proxy.addRoleForm)
        if (res.meta.status !== 200) {
          proxy.$message.error('添加角色失败')
        }
        proxy.$message.success('添加角色成功')
        proxy.addRolesDialogVisiable = false
        proxy.getRolesList()
      })
    },
    async editRoleForm (id) {
      const { data: res } = await proxy.$http.get('roles/' + id)
      if (res.meta.status !== 200) return proxy.$message.error('获取ID角色失败')
      proxy.$message.success('获取ID角色成功')
      proxy.editRolesForm = res.data
      proxy.editRolesDialogVisiable = true
    },
    editRoleDialogClose () {
      proxy.$refs.editRoleFormRef.resetFields()
    },
    editRoleInfo () {
      proxy.$refs.editRoleFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await proxy.$http.put('roles/' + proxy.editRolesForm.roleId, { roleName: proxy.editRolesForm.roleName, roleDesc: proxy.editRolesForm.roleDesc })
        if (res.meta.status !== 200) {
          proxy.$message.error('编辑角色失败')
        }
        proxy.$message.success('编辑角色成功')
        proxy.editRolesDialogVisiable = false
        proxy.getRolesList()
      })
    },
    async deleteRole (id) {
      const confirmResult = await proxy.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
        const { data: res } = await proxy.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          proxy.$message.error('删除用户失败')
        }
        proxy.$message.success('删除用户成功')
        proxy.getRolesList()
      }
    },
    async deleteRights (row, id) {
      const confirmResult = await proxy.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
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
        const { data: res } = await proxy.$http.delete(`roles/${row.id}/rights/${id}`)
        if (res.meta.status !== 200) {
          proxy.$message.error('删除权限失败')
        }
        proxy.$message.success('删除权限成功')
        row.children = res.data
      }
    },
    rightDialogClose () {
      proxy.defkeys = []
    },
    async showRightDialogSetting (row) {
      proxy.roleid = row.id
      const { data: res } = await proxy.$http.get('rights/tree')
      if (res.meta.status !== 200) return proxy.$message.error('获取权限列表失败')
      proxy.$message.success('获取权限列表成功')
      proxy.rightsList = res.data
      proxy.getleafkeys(row, proxy.defkeys)
      proxy.showRightsDialogVisiable = true
    },
    getleafkeys (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        proxy.getleafkeys(item, arr)
      })
    },

    async allowRights () {
      const keys = [...proxy.$refs.treeRef.getCheckedKeys(), ...proxy.$refs.treeRef.getHalfCheckedKeys()]
      const idstr = keys.join(',')
      const { data: res } = await proxy.$http.post(`roles/${proxy.roleid}/rights`, { rids: idstr })
      if (res.meta.status !== 200) return proxy.$message.error('分配权限失败')
      proxy.$message.success('分配权限成功')
      proxy.getRolesList()
      proxy.showRightsDialogVisiable = false
    }

    })
    roles.addRoleInfojieliu = computed(()=>{
     return  proxy.$jieliu(roles.addRoleInfo,2000) 
  })
      roles.editRoleInfojieliu = computed(()=>{
     return  proxy.$jieliu(roles.editRoleInfo,2000) 
  })
      roles.allowRightsjieliu = computed(()=>{
     return  proxy.$jieliu(roles.allowRights,2000) 
  })
    return {
     ...toRefs(roles)
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.top{
    border: 1px solid #eee;
}
.bottom{
    border: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
