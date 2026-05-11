<template>
  <div class="feedback-page">
    <el-card>
      <template #header>
        <el-space>
          <span>用户反馈</span>
          <el-select v-model="filterStatus" placeholder="筛选状态" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="已回复" value="replied" />
          </el-select>
        </el-space>
      </template>
      <el-table :data="filteredFeedbacks" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户" />
        <el-table-column prop="content" label="反馈内容" show-overflow-tooltip />
        <el-table-column prop="reply" label="回复" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'replied' ? 'success' : 'warning'">
              {{ row.status === 'replied' ? '已回复' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" size="small" @click="showReplyDialog(row)">回复</el-button>
            <el-button type="danger" size="small" @click="deleteFeedback(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="replyDialogVisible" title="回复反馈" width="400px">
      <el-form label-width="80px">
        <el-form-item label="回复内容">
          <el-input v-model="replyContent" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFeedbacks, replyFeedback, deleteFeedback as delFeedback } from '../api'

const feedbacks = ref([])
const filterStatus = ref('')
const replyDialogVisible = ref(false)
const currentFeedbackId = ref(null)
const replyContent = ref('')

const filteredFeedbacks = computed(() => {
  if (!filterStatus.value) return feedbacks.value
  return feedbacks.value.filter(f => f.status === filterStatus.value)
})

const loadFeedbacks = async () => {
  feedbacks.value = await getFeedbacks()
}

const showReplyDialog = (row) => {
  currentFeedbackId.value = row.id
  replyContent.value = ''
  replyDialogVisible.value = true
}

const submitReply = async () => {
  await replyFeedback(currentFeedbackId.value, replyContent.value)
  ElMessage.success('回复成功')
  replyDialogVisible.value = false
  loadFeedbacks()
}

const deleteFeedback = async (id) => {
  await ElMessageBox.confirm('确定删除该反馈?', '警告', { type: 'warning' })
  await delFeedback(id)
  ElMessage.success('已删除')
  loadFeedbacks()
}

onMounted(loadFeedbacks)
</script>