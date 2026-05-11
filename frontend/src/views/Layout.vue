<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <div class="logo">刷题管理系统</div>
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>首页概览</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/questions">
          <el-icon><Document /></el-icon>
          <span>题库管理</span>
        </el-menu-item>
        <el-menu-item index="/feedback">
          <el-icon><ChatDotRound /></el-icon>
          <span>用户反馈</span>
        </el-menu-item>
        <el-menu-item index="/ads">
          <el-icon><Goods /></el-icon>
          <span>广告管理</span>
        </el-menu-item>
        <el-menu-item index="/stats">
          <el-icon><PieChart /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
        <el-menu-item index="/risk">
          <el-icon><Warning /></el-icon>
          <span>风控管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span class="title">{{ $route.name }}</span>
        <el-button @click="handleLogout" type="danger" plain>退出登录</el-button>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.aside {
  background: #304156;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.main {
  background: #f0f2f5;
}
.el-menu {
  border: none;
}
:deep(.el-menu-item) {
  color: #bfcbd9;
}
:deep(.el-menu-item:hover) {
  background: #263445;
  color: #fff;
}
:deep(.el-menu-item.is-active) {
  background: #409eff;
  color: #fff;
}
</style>