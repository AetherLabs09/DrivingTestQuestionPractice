<template>
  <div class="risk-page">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header><span>作弊行为日志</span></template>
          <el-table :data="cheatLogs" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="behavior" label="行为描述" show-overflow-tooltip />
            <el-table-column prop="create_time" label="时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>违规账号处理</span></template>
          <el-table :data="violations" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="violation_type" label="违规类型" />
            <el-table-column prop="punishment" label="处罚" />
            <el-table-column prop="create_time" label="时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCheatLogs, getViolations } from '../api'

const cheatLogs = ref([])
const violations = ref([])

onMounted(async () => {
  cheatLogs.value = await getCheatLogs()
  violations.value = await getViolations()
})
</script>