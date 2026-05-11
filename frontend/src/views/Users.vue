<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <span>用户列表</span>
      </template>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'banned' ? 'danger' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="注册时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" size="small" @click="approveUser(row.id)">通过</el-button>
            <el-button v-if="row.status === 'approved'" type="warning" size="small" @click="banUser(row.id)">禁用</el-button>
            <el-button v-if="row.status === 'banned'" type="info" size="small" @click="approveUser(row.id)">解禁</el-button>
            <el-button type="danger" size="small" @click="deleteUser(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, updateUserStatus, deleteUser as delUser } from '../api'

const users = ref([])

const loadUsers = async () => {
  users.value = await getUsers()
}

const approveUser = async (id) => {
  await updateUserStatus(id, 'approved')
  ElMessage.success('已通过')
  loadUsers()
}

const banUser = async (id) => {
  await updateUserStatus(id, 'banned')
  ElMessage.warning('已禁用')
  loadUsers()
}

const deleteUser = async (id) => {
  await ElMessageBox.confirm('确定删除该用户?', '警告', { type: 'warning' })
  await delUser(id)
  ElMessage.success('已删除')
  loadUsers()
}

onMounted(loadUsers)
</script>