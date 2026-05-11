<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">总用户数</div>
            <div class="stat-value">{{ stats.totalUsers }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">待审核用户</div>
            <div class="stat-value warning">{{ stats.pendingUsers }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">题库总量</div>
            <div class="stat-value">{{ stats.totalQuestions }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">待审核题目</div>
            <div class="stat-value warning">{{ stats.pendingQuestions }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">待处理反馈</div>
            <div class="stat-value warning">{{ stats.pendingFeedback }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-label">待审核广告</div>
            <div class="stat-value warning">{{ stats.pendingAds }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOverview } from '../api'

const stats = ref({
  totalUsers: 0,
  pendingUsers: 0,
  totalQuestions: 0,
  pendingQuestions: 0,
  pendingFeedback: 0,
  pendingAds: 0
})

onMounted(async () => {
  stats.value = await getOverview()
})
</script>

<style scoped>
.stat-item {
  text-align: center;
}
.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
}
.stat-value.warning {
  color: #e6a23c;
}
</style>