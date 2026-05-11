<template>
  <div class="questions-page">
    <el-card>
      <template #header>
        <el-space>
          <span>题库管理</span>
          <el-select v-model="filterStatus" placeholder="筛选状态" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
          <el-button type="primary" @click="dialogVisible = true">新增题目</el-button>
        </el-space>
      </template>
      <el-table :data="filteredQuestions" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content" label="题目内容" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="difficulty" label="难度" width="80">
          <template #default="{ row }">
            <el-tag :type="row.difficulty === 1 ? 'success' : row.difficulty === 2 ? 'warning' : 'danger'">
              {{ row.difficulty === 1 ? '简单' : row.difficulty === 2 ? '中等' : '困难' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'approved' ? '已通过' : row.status === 'pending' ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" size="small" @click="reviewQuestion(row.id, 'approved')">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" size="small" @click="reviewQuestion(row.id, 'rejected')">拒绝</el-button>
            <el-button size="small" @click="editQuestion(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="showCorrectDialog(row)">错题修正</el-button>
            <el-button type="danger" size="small" @click="deleteQuestion(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingQuestion ? '编辑题目' : '新增题目'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="题目内容">
          <el-input v-model="form.content" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="选项">
          <el-input v-model="form.optionsText" type="textarea" rows="3" placeholder='格式: {"A":"选项1","B":"选项2"}' />
        </el-form-item>
        <el-form-item label="正确答案">
          <el-input v-model="form.answer" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category">
            <el-option label="科目一" value="科目一" />
            <el-option label="科目二" value="科目二" />
            <el-option label="科目三" value="科目三" />
            <el-option label="科目四" value="科目四" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-rate v-model="form.difficulty" :max="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitQuestion">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="correctDialogVisible" title="错题修正" width="400px">
      <el-form label-width="80px">
        <el-form-item label="修正说明">
          <el-input v-model="errorCorrection" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="correctDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCorrection">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getQuestions, createQuestion, updateQuestion, reviewQuestion as apiReview, correctQuestion, deleteQuestion as delQuestion } from '../api'

const questions = ref([])
const filterStatus = ref('')
const dialogVisible = ref(false)
const correctDialogVisible = ref(false)
const editingQuestion = ref(null)
const currentQuestionId = ref(null)
const errorCorrection = ref('')

const form = ref({
  content: '',
  optionsText: '',
  answer: '',
  category: '科目一',
  difficulty: 1
})

const filteredQuestions = computed(() => {
  if (!filterStatus.value) return questions.value
  return questions.value.filter(q => q.status === filterStatus.value)
})

const loadQuestions = async () => {
  questions.value = await getQuestions()
}

const editQuestion = (row) => {
  editingQuestion.value = row
  form.value = {
    content: row.content,
    optionsText: JSON.stringify(row.options),
    answer: row.answer,
    category: row.category,
    difficulty: row.difficulty
  }
  dialogVisible.value = true
}

const submitQuestion = async () => {
  const options = JSON.parse(form.value.optionsText)
  if (editingQuestion.value) {
    await updateQuestion(editingQuestion.value.id, { ...form.value, options })
    ElMessage.success('更新成功')
  } else {
    await createQuestion({ ...form.value, options })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  editingQuestion.value = null
  loadQuestions()
}

const reviewQuestion = async (id, status) => {
  await apiReview(id, status)
  ElMessage.success('审核完成')
  loadQuestions()
}

const showCorrectDialog = (row) => {
  currentQuestionId.value = row.id
  errorCorrection.value = ''
  correctDialogVisible.value = true
}

const submitCorrection = async () => {
  await correctQuestion(currentQuestionId.value, errorCorrection.value)
  ElMessage.success('已提交修正')
  correctDialogVisible.value = false
}

const deleteQuestion = async (id) => {
  await ElMessageBox.confirm('确定删除该题目?', '警告', { type: 'warning' })
  await delQuestion(id)
  ElMessage.success('已删除')
  loadQuestions()
}

onMounted(loadQuestions)
</script>