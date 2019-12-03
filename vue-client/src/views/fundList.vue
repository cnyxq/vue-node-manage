<template>
  <div class="fill_container">
    <el-form :inline="true" ref="add_data" :model="search_data">
      <el-form-item label="按照时间筛选：">
        <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="任意时间点"></el-date-picker>
        <span>--</span>
        <el-date-picker arrow-control v-model="search_data.endTime" type="datetime" placeholder="任意时间点"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' size="search" @click="handleSearch()">筛选</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type='primary' size="small" @click="handleAdd()" v-if="user.identity == 'manager'">添加</el-button>
      </el-form-item>
    </el-form>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="序号" type="index" width="70" align="center"></el-table-column>
        <el-table-column label="日期" prop="date" width="250" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收支类型" prop="type" width="150" align="center"></el-table-column>
        <el-table-column label="收支描述" prop="describe" width="180" align="center"></el-table-column>
        <el-table-column label="收入" prop="income" width="170" align="center">
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支出" prop="expend" width="170" align="center">
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户现金" prop="cash" width="170" align="center">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="220" align="center"></el-table-column>
        <el-table-column label="操作" prop="operation" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="user.identity == 'manager'">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="user.identity == 'manager'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <dia-log :dialog="dialog" :formData="formData" @update="getProfile"></dia-log>
  </div>
</template>

<script>
import DiaLog from '../components/DiaLog'
export default {
  data () {
    return {
      search_data: {
        startTime: '',
        endTime: ''
      },
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: '',
        option: 'edit'
      },
      formData: {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: ''
      },
      paginations: {
        page_index: 1, // 当前位于哪一页
        total: 0, // 总数
        page_size: 5, // 一页显示多少条
        page_sizes: [5,10], // 每页显示多少条
        layout: 'total,sizes,prev,pager,next,jumper' //翻页属性
      }
    }
  },
  created () {
    this.getProfile()
  },
  methods: {
    getProfile () {
      this.$axios.get('/api/profiles')
        .then(res => {
          this.allTableData = res.data
          this.filterTableData = res.data
          this.setPaginations()
        })
    },
    setPaginations () {
      this.paginations.total = this.allTableData.length
      this.paginations.page_index = 1
      this.paginations.page_size = 10
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size
      })
    },
    handleSizeChange (page_size) { // 控制一页显示的数据量
      this.paginations.page_index = 1
      this.paginations.page_size = page_size
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size
      })
    },
    handleCurrentChange (page) { // 分页跳转
      let tables = []
      // 当前页前面有多少数据
      let index = this.paginations.page_size * (page - 1)
      let nums = this.paginations.page_size * page
      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i])
        }
      }
      this.tableData = tables
    },
    handleEdit (index, row) {
      this.dialog = {
        show: true,
        title: '编辑资金信息',
        option: 'edit'
      }
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      }
      console.log(row.date)
    },
    handleDelete (index, row) {
      console.log(row.date)
      this.$axios.delete(`/api/profiles/delete/${row._id}`)
        .then(res => {
          this.$message({
            message: '删除数据成功！',
            type: 'success'
          })
          this.getProfile()
        })
    },
    handleAdd () {
      this.dialog = {
        show: true,
        title: '添加资金信息',
        option: 'add'
      }
      this.formData = {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: ''
      }
    },
    handleSearch () {
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择时间!'
        })
        return
      }
      const sTime = this.search_data.startTime.getTime()
      const eTime = this.search_data.endTime.getTime()
      // 时间筛选
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date)
        let time = date.getTime()
        return time >= sTime && time <= eTime
      })
      // 筛选后从新分页
      this.setPaginations()
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  components: {
    DiaLog
  }
}
</script>

<style scoped>
.fill_container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>