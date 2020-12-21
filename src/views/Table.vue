/* eslint-disable @typescript-eslint/no-empty-function */
<template>
  <div class="table-list">
    <div class="search-form">
      <el-form :inline="true" :model="tableDataList" size="mini" class="demo-form-inline">
        <el-form-item label="商品ID">
          <el-input v-model="tableDataList.id" placeholder="请输入id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-data">
      <el-table border :max-height="tableMinHeight()" :data="tableDataList.list" style="width: 100%">
        <el-table-column fixed prop="id" label="ID" width="150">
        </el-table-column>
        <el-table-column prop="IPMode" label="IPMode" width="120">
        </el-table-column>
        <el-table-column prop="IPStatus" label="IPStatus" width="120">
        </el-table-column>
        <el-table-column prop="address" label="address" width="120">
        </el-table-column>
        <el-table-column prop="connectionTrigger" label="connectionTrigger" width="150"> </el-table-column>
        <el-table-column prop="currentGateway" label="currentGateway" width="150"> </el-table-column>
        <el-table-column prop="username" label="username" width="120"> </el-table-column>
        <el-table-column prop="password" label="password" width="120"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button
              @click="deleteRow(scope.$index, scope.row)"
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import {getTableList, getItem, deleteItem} from "@/api/index";
export default {
  setup() {
    const tableDataList = reactive({id:'', list:[]});
    function getList(){
        getTableList().then((data) => {
            if(data.err === "") {
                tableDataList.list = data.result;
            }
        });
    }
    getList(); // 默认第一次拉取数据 一定要先 执行npm run mock 启动mock服务
    function tableMinHeight(){
        return (window.innerHeight - 156);
    }

    function onSearch(){
        getItem({id: (tableDataList.id)}).then((data) => {
            if(data.err === "") {
                let arr = [];
                arr.push(data.result);
                tableDataList.list = arr;
            }
        });
    }
    function deleteRow(index, row){
        // console.log(index, row, 'params');
        deleteItem({id:row.id}).then((data) => {
            console.log(data, 'delete');
            if(data.err === "") {
                getList();
            }
        });
    }

    return {
        tableDataList,
        tableMinHeight,
        onSearch,
        deleteRow
    };
  },
};
</script>

<style lang="less" scoped>
</style>