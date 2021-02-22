<template>
  <div class="jsontable">
    <!-- 表单查询 -->
    <el-form
      :inline="true"
      size="mini"
      :model="searchForm"
      class="json-table-form"
      :inline-message="true"
      ref="formRef"
    >
      <div class="search-form">
        <el-form-item
          class="search-item"
          v-for="(item, index) in searchColumnsList"
          :key="item.prop + index"
          :label="item.label"
          :prop="item.prop"
        >
          <!-- input -->
          <el-input
            v-if="!(item.isSelect || item.isTime || item.isCascader)"
            :clearable="item.clearable"
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder || '请输入内容'"
            @change="handleChange"
          >
          </el-input>
          <!-- select -->
          <el-select
            v-if="item.isSelect"
            :clearable="item.clearable"
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder || '请选择'"
            @change="handleChange"
          >
            <el-option
              v-for="(option, optionInd) in item.options"
              :key="option.prop + optionInd"
              :label="option.name"
              :value="option.prop"
            >
            </el-option>
          </el-select>
          <!-- cascader -->
          <el-cascader
            v-if="item.isCascader"
            v-model="searchForm[item.prop]"
            :clearable="item.clearable"
            :options="item.options"
            @change="handleChange"
            :placeholder="item.placeholder || '请选择'"
          >
          </el-cascader>
          <!-- date -->
          <el-date-picker
            v-if="item.isTime === 'date'"
            v-model="searchForm[item.prop]"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="选择日期"
            @change="
              val => {
                formatDate(val, searchForm, item.prop);
              }
            "
          >
          </el-date-picker>

          <!-- datetimerange -->
          <el-date-picker
            v-if="item.isTime === 'datetimerange'"
            v-model="searchForm[item.prop]"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            @change="
              val => {
                formatDate(val, searchForm, item.prop);
              }
            "
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item class="submit-btn">
        <el-button type="primary" @click="handleSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单与表格中间插入内容 -->
    <div class="under-search-slot">
      <slot name="under-search-slot"></slot>
    </div>
    <!-- 表格内容 -->
    <div class="table">
      <el-table
        v-loading="isLoading"
        ref="tableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        :height="tableHeight"
      >
        <el-table-column
          :fixed="tableOptions.checkFixed"
          v-if="tableOptions.canCheck"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          :fixed="tableOptions.indexFixed"
          v-if="tableOptions.hasIndex"
          type="index"
          width="50"
          label="序号"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumnsList"
          :key="item.prop + index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :show-overflow-tooltip="item.overflow"
        >
          <!-- :show-overflow-tooltip="item.overflow" 貌似elementplus有bug -->
          <template #default="scope" v-if="item.expandFunc">
            <el-tooltip v-if="item.imgW" placement="right">
              <template #content>
                <img
                  referrerpolicy="no-referrer"
                  :src="scope.row[item.prop]"
                  :width="item.imgW || 300"
                  class="img-height"
                  alt="此图不存在，请检查url"
                />
              </template>
              <el-button type="primary" size="mini">预览</el-button>
            </el-tooltip>
            <span
              v-if="item.isMultiCell && item.render"
              v-html="item.render(scope)"
            ></span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          :width="tableOptions.opW || 150"
        >
          <!-- 操作栏插槽 -->
          <template #default="scope">
            <slot name="op" v-bind:scope="scope"></slot>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[20, 25, 50, 100]"
          :page-size="pagination.psize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, watch, nextTick } from "vue";
import dayjs from "dayjs";
import { useInitSearchForm } from "./composition/useSearchForm.js";

export default {
  props: {
    searchColumns: Array,
    service: Object,
    tableColumns: Array,
    options: Object
  },
  name: "json-table",
  emits: ["onformchange", "rowselectchange"],
  setup(props, { emit }) {
    // 初始化属性值
    let {
      searchForm,
      formatDate,
      handleSubmit,
      tableData,
      caculateTableHeight,
      pagination,
      isLoading
    } = useInitSearchForm(props);

    // 分页相关
    let handleSizeChange = val => {
      pagination.psize = val;
      handleSubmit();
    };
    let handleCurrentChange = val => {
      pagination.page = val;
      handleSubmit();
    };

    // change事件
    let handleChange = () => {
      emit("onformchange", searchForm);
    };

    // selectChange事件
    let handleSelectionChange = val => {
      emit("rowselectchange", val);
    };

    // 表格高度计算
    const tableRef = ref(null);
    let tableHeight = ref(0);

    watch(() => props.options.startUpdate, () => {
        handleSubmit();
    });

   
  

    onMounted(() => {
      // 计算表格高度
      caculateTableHeight(tableHeight, tableRef);
       // 是否要手动请求
      if (props.options.autoRequest) {
        handleSubmit();
      }
    });

    return {
      pagination, // 分页相关
      tableRef,
      tableHeight,
      dayjs, // 处理日期格式
      handleChange,
      searchColumnsList: props.searchColumns, // 传递的配置数据
      tableColumnsList: props.tableColumns, // 表格的配置数据
      tableData, // 表格数据
      tableOptions: props.options, // 表格属性
      searchForm, // 双向绑定数据
      handleSubmit, // 提交
      formatDate, // 日期change
      handleSelectionChange, // 行选择事件
      handleSizeChange,
      handleCurrentChange,
      isLoading
    };
  }
};
</script>
<style lang="less">
@import "@/style/variable.less";
.jsontable {
  .el-input--mini .el-input__inner {
    width: 120px;
  }
  .el-range-editor--mini.el-input__inner {
    width: 200px;
  }
  .el-input--prefix .el-input__inner {
    width: 230px;
  }
  .el-form--inline .el-form-item__label {
    font-size: 12px;
  }
  .under-search-slot {
    border-top: 1px solid #eee;
    padding: 5px 0;
  }
  .el-table td,
  .el-table th.is-leaf {
    text-align: center;
    font-weight: normal;
    color: #333;
    font-size: 12px;
  }
  .el-table .cell {
    text-align: center;
  }
  .pagination {
    height: 35px;
  }
  .el-pagination {
    float: right;
  }
  .search-item {
    margin: 0 10px;
  }
  .json-table-form{
      display: flex;
      justify-content: flex-start;
  }
  .search-form{
      width: 1200px;
  }
  .el-table__body{
    overflow: scroll-y;
    z-index: 999;
    background: red;
  }
}
</style>
