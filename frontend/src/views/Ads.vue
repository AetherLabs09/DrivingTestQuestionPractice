<template>
  <div class="ads-page">
    <el-card>
      <template #header>
        <el-space>
          <span>广告内容管理</span>
          <el-button type="primary" @click="dialogVisible = true">新增广告</el-button>
        </el-space>
      </template>
      <el-table :data="ads" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content" label="广告内容" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'approved' ? '已通过' : row.status === 'pending' ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" size="small" @click="updateStatus(row.id, 'approved')">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" size="small" @click="updateStatus(row.id, 'rejected')">拒绝</el-button>
            <el-button type="danger" size="small" @click="deleteAd(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增广告" width="400px">
      <el-form label-width="80px">
        <el-form-item label="广告内容">
          <el-input v-model="adContent" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAd">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAds, createAd, updateAdStatus, deleteAd as delAd } from '../api'

const ads = ref([])
const dialogVisible = ref(false)
const adContent = ref('')

const loadAds = async () => {
  ads.value = await getAds()
}

const submitAd = async () => {
  await createAd(adContent.value)
  ElMessage.success('已添加')
  dialogVisible.value = false
  adContent.value = ''
  loadAds()
}

const updateStatus = async (id, status) => {
  await updateAdStatus(id, status)
  ElMessage.success('已更新')
  loadAds()
}

const deleteAd = async (id) => {
  await ElMessageBox.confirm('确定删除?', '警告', { type: 'warning' })
  await delAd(id)
  ElMessage.success('已删除')
  loadAds()
}

onMounted(loadAds)
</script>