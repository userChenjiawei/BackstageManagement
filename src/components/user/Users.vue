<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <!-- <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button> -->
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisiable = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table border stripe :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="default"
              @click="editUser(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="default"
              @click="deleteUser(scope.row.id)"
              >删除</el-button
            >
            <el-tooltip
              effect="dark"
              content="设定角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="default"
                @click="setRole(scope.row)"
                >设置</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      @close="addDialogClose"
      title="添加用户"
      v-model="addDialogVisiable"
      width="30%"
    >
      <el-form
        :model="addForm"
        :rules="addFromrules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="addUserOFjieliu">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      @close="editDialogClose"
      title="编辑"
      v-model="editDialogVisiable"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFromrules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfojieliu"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="分配角色"
      v-model="roleDialogVisiable"
      width="30%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleID" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfojieliu"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   Setting,
//   Edit,
//   Delete
// } from '@element-plus/icons-vue'
import { reactive, toRefs } from "@vue/reactivity";
import { computed, getCurrentInstance, watch } from "vue";
export default {
  setup() {
    let { proxy } = getCurrentInstance();
    let user = reactive({
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      timeid: null,
      jieliuTimeid: null,
      userList: [],
      total: 0,
      addDialogVisiable: false,
      editDialogVisiable: false,
      roleDialogVisiable: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
      addFromrules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      editFromrules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { message: "长度在11个字符", trigger: "blur" },
        ],
      },
      userInfo: {},
      roleList: [],
      selectedRoleID: "",

      async getUserList() {
        const { data: res } = await proxy.$http.get("users", user.queryInfo);
        console.log(res);
        if (res.meta.status !== 200)
          return proxy.$message.error("获取用户列表失败");
        user.userList = res.data.users;
        user.total = res.data.total;
      },
      handleSizeChange(newsize) {
        user.queryInfo.pagesize = newsize;
        user.getUserList();
      },
      handleCurrentChange(newpage) {
        user.queryInfo.pagenum = newpage;
        user.getUserList();
      },
      async changState(q) {
        const { data: res } = await proxy.$http.put(
          `users/${q.id}/state/${q.mg_state}`
        );
        if (res.meta.status !== 200) {
          q.mg_state = !q.mg_state;
          return proxy.$message.error("更改用户状态失败");
        }
        return proxy.$message.success("更改用户状态成功");
      },
      addDialogClose() {
        proxy.$refs.addFormRef.resetFields();
      },
      addUser() {
        proxy.$refs.addFormRef.validate(async (vaild) => {
          if (!vaild) return;
          const { data: res } = await proxy.$http.post("users", user.addForm);
          if (res.meta.status !== 200) {
            proxy.$message.error("添加用户失败");
          }
          proxy.$message.success("添加用户成功");
          proxy.addDialogVisiable = false;
          user.getUserList();
        });
      },

      async deleteUser(id) {
        const confirmResult = await proxy
          .$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .catch(() => {
            proxy.$message({
              type: "info",
              message: "已取消删除",
            });
          });
        if (confirmResult === "confirm") {
          const { data: res } = await proxy.$http.delete("users/" + id);
          console.log(id, "9999");
          if (res.meta.status !== 200) {
            proxy.$message.error("删除用户失败");
          }
          proxy.$message.success("删除用户成功");
          user.getUserList();
        }
      },
      async editUser(id) {
        const { data: res } = await proxy.$http.get("users/" + id);
        if (res.meta.status !== 200) {
          proxy.$message.error("获取用户信息失败");
        }
        user.editForm = res.data;
        proxy.$message.success("获取用户信息成功");
        user.editDialogVisiable = true;
      },
      async editUserInfo() {
        proxy.$refs.editFormRef.validate(async (vaild) => {
          if (!vaild) return;
          const { data: res } = await proxy.$http.put(
            "users/" + user.editForm.id,
            { email: user.editForm.email, mobile: user.editForm.mobile }
          );
          if (res.meta.status !== 200) {
            proxy.$message.error("修改用户信息失败");
          }
          proxy.$message.success("修改用户信息成功");
          user.editDialogVisiable = false;
          user.getUserList();
        });
      },
      editDialogClose() {
        proxy.$refs.editFormRef.resetFields();
      },
      async setRole(row) {
        user.userInfo = row;
        const { data: res } = await proxy.$http.get("roles");
        if (res.meta.status !== 200) {
          proxy.$message.error("获取角色失败");
        }
        user.roleList = res.data;
        proxy.$message.success("获取角色成功");
        user.roleDialogVisiable = true;
      },
      async saveRoleInfo() {
        if (!user.selectedRoleID)
          return proxy.$message.error("请选择要分配的角色");
        const { data: res } = await proxy.$http.put(
          `users/${user.userInfo.id}/role`,
          { rid: user.selectedRoleID }
        );
        if (res.meta.status !== 200) {
          proxy.$message.error("更新角色失败");
        }
        proxy.$message.success("更新角色成功");
        user.getUserList();
        user.roleDialogVisiable = false;
      },
      setRoleDialogClosed() {
        user.selectedRoleID = "";
        user.userInfo = [];
      },
    });
    watch(
      () => user.queryInfo.query,
      () => {
        proxy.timeid = proxy.$fangdou(proxy.getUserList, 500, proxy.timeid);
      }
    ), //监测inpute的变化，触发响应函数，做防抖处理，需要timeid返回赋值
      (user.addUserOFjieliu = computed(() => {
        return proxy.$jieliu(user.addUser, 2000);
      })),
      (user.editUserInfojieliu = computed(() => {
        return proxy.$jieliu(user.editUserInfo, 2000);
      })),
      (user.saveRoleInfojieliu = computed(() => {
        return proxy.$jieliu(user.saveRoleInfo, 2000);
      }));
    return { ...toRefs(user) };
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.dialog-footer .el-button:first-child {
  margin-right: 10px;
}
</style>
