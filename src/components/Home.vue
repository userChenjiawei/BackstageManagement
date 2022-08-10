<template>
      <el-container class="home-container">
        <el-header>
          <div>
            <img src="../assets//heima.png" alt="">
            后台管理系统
          </div>
              <homeBackGround/>
          <el-button @click="click(e)">全屏</el-button>
          <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
          <el-aside :width="iscollapse ? '64px' : '200px'">
            <div class="toggle_button" @click="collapseMenu">|||</div>
             <el-menu unique-opened :collapse="iscollapse" router
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff">
      <el-sub-menu :index="item.id+''" v-for="item in menuList" :key="item.id">
        <template #title>
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/'+subitem.path+''" v-for="subitem in item.children" :key="subitem.id" @click="getActivePath('/'+subitem.path)">
            <template #title>
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
        </template>
          </el-menu-item>
      </el-sub-menu>
             </el-menu>

             <el-menu unique-opened :collapse="iscollapse"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff">
        <el-sub-menu>
                  <template #title>  
                           <i class="iconfont icon-lock_fill"></i>
          <span>My</span>
        </template>
          <el-menu-item @click="toZIP">
            <template #title>
 <!-- <i class="el-icon-menu"></i> -->
    &nbsp;&nbsp;&nbsp;<span>zip</span>
        </template>
          </el-menu-item>
                    <el-menu-item @click="toFixedHeaderTable">
            <template #title>
 <!-- <i class="el-icon-menu"></i> -->
    &nbsp;&nbsp;&nbsp;<span>FixedHeadleTable</span>
        </template>
          </el-menu-item>
           <el-menu-item @click="tounfixedHeaderTable">
            <template #title>
 <!-- <i class="el-icon-menu"></i> -->
    &nbsp;&nbsp;&nbsp;<span>unFixedHeaderTable</span>
        </template>
          </el-menu-item>
          <el-menu-item @click="toUpLoadExcel">
            <template #title>
 <!-- <i class="el-icon-menu"></i> -->
    &nbsp;&nbsp;&nbsp;<span>UpLoadExcel</span>
        </template>
          </el-menu-item>
            <el-menu-item @click="toPrintPDF">
            <template #title>
 <!-- <i class="el-icon-menu"></i> -->
    &nbsp;&nbsp;&nbsp;<span>PrintPDF</span>
        </template>
          </el-menu-item>
        </el-sub-menu>
             </el-menu>
          </el-aside>
                    <homeBackGround/>
          <el-main><router-view></router-view></el-main>
        </el-container>
      </el-container>
</template>

<script>
import screenfull from 'screenfull'
import homeBackGround from './home_back.vue'
import { reactive, toRefs } from '@vue/reactivity'
const sf = screenfull
import {getCurrentInstance} from 'vue'

export default {
  components:{homeBackGround},
  setup(){
     let { proxy } = getCurrentInstance()
    let home = reactive({
       menuList: [],
       
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isFullscreen: false,
       change() {
       if (sf.isEnabled) {
      // proxy.isFullscreen = sf.isFullscreen
    }},
      iscollapse: false,
      activePath: '',
      logout () {
      window.sessionStorage.clear()
      proxy.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取菜单失败')
      this.menuList = res.data
    },
    collapseMenu () {
      this.iscollapse = !this.iscollapse
    },
    getActivePath (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    toZIP(){
      proxy.$router.push('/zip')
    },
    toFixedHeaderTable(){
      proxy.$router.push('/fixedHeaderTable')
    },
    tounfixedHeaderTable(){
      proxy.$router.push('/unfixedHeaderTable')
    },
    toUpLoadExcel(){
      proxy.$router.push('/upLoadExcel')
    },
    toPrintPDF(){
      proxy.$router.push('/printPDF')
    },
       click() {
    // if (!sf.isEnabled) {
    //   // this.$message({
    //   //   message: 'you browser can not work',
    //   //   type: 'warning'
    //   // })
    //   console.log("error");
    //   return false
    // }

    sf.toggle()
  }
    })
    return {
     ...toRefs(home)
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted(){
     if (sf.isEnabled) {
      console.log("aa");
      // sf.on('change', this.change)
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  display: flex;
  justify-content: space-between;
  padding-left: 2px;
  background-color: #373d41;
  align-items: center;
  color: #fff;
  font-size: 30px;
  >div{
    img{
      margin-right: 10px;
    }
    display: flex;
    align-items: center;
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
  .toggle_button{
    color: #fff;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
}
.el-main{
  background-color: #eaedf1;
}
.home-container{
  height: 100%;
}.iconfont{
  margin-right: 10px;
}

</style>
