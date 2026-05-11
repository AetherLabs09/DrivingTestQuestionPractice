<template>
  <div class="stats-page">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header><span>用户活跃度</span></template>
          <el-table :data="userActivity" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="total_questions" label="答题总数" />
            <el-table-column prop="correct_questions" label="正确数" />
            <el-table-column prop="practice_count" label="练习次数" />
            <el-table-column prop="last_practice" label="最后练习" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>科目通过率</span></template>
          <el-table :data="passRate" style="width: 100%">
            <el-table-column prop="passed" label="通过人数" />
            <el-table-column prop="total" label="总人数" />
            <el-table-column prop="rate" label="通过率(%)" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header><span>答题正确率</span></template>
          <el-table :data="answerRate" style="width: 100%">
            <el-table-column prop="category" label="科目" />
            <el-table-column prop="total" label="总答题" />
            <el-table-column prop="correct" label="正确" />
            <el-table-column prop="rate" label="正确率(%)" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>热门考点</span></template>
          <el-table :data="hotTopics" style="width: 100%">
            <el-table-column prop="category" label="科目" width="100" />
            <el-table-column prop="content" label="题目" show-overflow-tooltip />
            <el-table-column prop="answer_count" label="答题次数" width="100" />
            <el-table-column prop="error_rate" label="错误率(%)" width="100" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserActivity, getAnswerRate, getPassRate, getHotTopics } from '../api'

const userActivity = ref([])
const answerRate = ref([])
const passRate = ref([])
const hotTopics = ref([])

onMounted(async () => {
  userActivity.value = await getUserActivity()
  answerRate.value = await getAnswerRate()
  passRate.value = await getPassRate()
  hotTopics.value = await getHotTopics()
})
</script>