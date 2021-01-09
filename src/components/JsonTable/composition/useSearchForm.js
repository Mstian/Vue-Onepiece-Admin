import {reactive, ref, nextTick} from 'vue';
import dayjs from 'dayjs';
export function useInitSearchForm(props) {
    let searchForm = reactive({}); // 初始化表单项
    const isLoading = ref(false); // 控制loading
    const tableData = ref([]); // 表格数据
    props.searchColumns.forEach((item, index) => {
        searchForm[item.prop] = "";
    });
    let pagination = reactive({ // 分页相关
        page: 1,
        psize: 20,
        total: 0
    });
    let formatDate = (val, searchForm, prop) => { // 格式化日期
        if (Array.isArray(val)) {
            let temp = [dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss'), dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss')];
            searchForm[prop] = temp;
        } else {
            searchForm[prop] = dayjs(val).format('YYYY-MM-DD');
        }
    };

    let handleSubmit = () => { // 提交
        isLoading.value = true;
        let temp = {
            page: pagination.page,
            psize: pagination.psize,
            params: searchForm
        };
        props.service.get(temp).then((res) => {
            console.log(res);
            if (res.code === 0) {
                isLoading.value = false; // 控制loading
                tableData.value = res.data;
                pagination.total = res.data.length;
            }
        });
    };

    let caculateTableHeight = (tableHeight, tableRef) => {
        nextTick().then(() => {
            let total = tableRef.value.$el.offsetTop + tableRef.value.$el.offsetParent.offsetTop + tableRef.value.$el.nextElementSibling.offsetHeight + 20;
            tableHeight.value = window.innerHeight - total;
        });
    };

    return {
        searchForm,
        formatDate,
        handleSubmit,
        tableData,
        caculateTableHeight,
        pagination,
        isLoading
    };
}