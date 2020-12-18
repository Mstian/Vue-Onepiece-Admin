<template>
    <div class="common-list-wrap">
        <!--搜索框-->
        <el-form ref="searchForm" :inline="true" :model="searchForm" size="mini"
                 :class="['row',isTeacher ? 'm-0' : 'justify-content-between']"
                 @submit.native.prevent="searchData" :inline-message="true">
            <div :class="{'col-10':!isTeacher}" v-show="tempSearchColumns && !options.showSearchForm">
                <el-form-item v-if="!isTeacher" class="float-right">
                    <el-button type="primary" native-type="submit" icon="el-icon-search">查询</el-button>
                </el-form-item>
                <el-form-item v-for="(column, key) in tempSearchColumns" :key="column.prop + '#' + key"
                              :label="column.label" :prop="column.prop"
                              :rules="column.rules">
                    <!--输入框-->
                    <el-input v-if="!(column.isSelect || column.isTime || column.isCascader)"
                              v-model="searchForm[column.prop]" @change="handleInput(searchForm[column.prop])"
                              :clearable="column.clearable"
                              :class="{'md-select':column.size === 'md'}"
                              :placeholder="column.placeholder ? column.placeholder : '请输入内容'">
                    </el-input>
                    <!--选择框-->
                    <el-select v-if="column.isSelect" v-model="searchForm[column.prop]" placeholder="请选择"
                               :multiple="column.isMultiple"
                               :allow-create="column.allowCreate" :default-first-option="true"
                               collapse-tags
                               :filterable="column.filterable"
                               :remote="column.isRemoteSearch"
                               :loading="column.isLoading"
                               :reserve-keyword="column.isReserveKey"
                               :remote-method="(query) => searchRemote(query, column.prop)"
                               :clearable="column.clearable"
                               :class="{'md-select':column.size === 'md','ld-select':column.size === 'ld'}"
                               @change="handleChange(column)">
                        <el-option v-for="(option, oKey) in column.options" :key="oKey" :value="option.prop"
                                   :label="option.name"></el-option>
                    </el-select>
                    <el-cascader
                        v-if="column.isCascader"
                        v-model="searchForm[column.prop]"
                        :props="column.props"
                        :key="JSON.stringify(searchForm[column.prop])"
                        expand-trigger="hover"
                        clearable
                        filterable
                        :collapse-tags="column.collapse !== undefined ? column.collapse : false"
                        :change-on-select="column.changeSelect !== undefined ? column.changeSelect : true"
                        class="col pl-0 pr-0 md-select"
                        :options="column.options"
                    ></el-cascader>
                    <!--选择日期时间区间-->
                    <el-date-picker
                        v-if="column.isTime && ['datetimerange','daterange'].includes(column.isTime)"
                        v-model="searchForm[column.prop]"
                        :type="column.isTime"
                        :value-format="column.valueFormat"
                        placeholder="选择日期"
                        :range-separator="column.size === 'md' ? '-' : '至'"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :class="{'md-date-pick':column.size === 'md'}"
                        :default-time="column.defaultTime || []">
                    </el-date-picker>
                    <!--选择日期时间点-->
                    <el-date-picker
                        v-else-if="column.isTime"
                        v-model="searchForm[column.prop]"
                        :type="column.isTime"
                        :value-format="column.valueFormat"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-if="settingSearchColumns && settingSearchColumns.length > 0" class="ml-3">
                    <el-dropdown trigger="click" :hide-on-click="false">
                        <el-button class="el-dropdown-link" type="text" icon="el-icon-setting">查询配置</el-button>
                        <el-dropdown-menu slot="dropdown" class="pre-scrollable">
                            <el-checkbox-group @change="settingSearchCols" v-model="settingSearch"
                                               class="d-flex flex-column pl-3 pr-3">
                                <el-checkbox v-for="(item, index) in settingSearchColumns" :key="index"
                                             :label="item.prop">{{item.label}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-form-item v-if="isTeacher" class="ml-3">
                    <el-button type="primary" native-type="submit" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </div>
            <div v-if="!isTeacher" class="col-2 pop-btn-wrap" :class="{'offset-10': !tempSearchColumns}">
                <!--右上角的功能按钮-->
                <slot name="pop-buttons"></slot>
                <el-button
                    size="mini"
                    class="float-right download-all"
                    v-if="options.downloadUrl"
                    icon="el-icon-download"
                    type="primary"
                    plain
                    @click="downloadLists()">全部导出
                </el-button>
            </div>
        </el-form>
        <!--检索框 与 list table 之间的 slot-->
        <slot name="under-search-slot">
        </slot>
        <!--列表-->
        <el-table ref="table" :data="tableData" border stripe highlight-current-row :height="tableHeight ? tableHeight : options.tableHeight"
                  :default-expand-all="options.expandAll" :span-method="spanMethod" :row-class-name="tableRowClassName"
                  header-row-class-name="header_class" @current-change="handleSingleSelect"
                  @sort-change="sortColumn" @selection-change="handleSelection" v-loading="isLoadingList">
            <el-table-column :fixed="options.checkFixed" v-if="options.canCheck" type="selection"
                             width="55"></el-table-column>
            <el-table-column :fixed="options.indexFixed" v-if="options.hasIndex" type="index" width="50"
                             label="序号"></el-table-column>
            <el-table-column v-for="(column, key) in tableColumns" :key="key" :width="column.width"
                             :min-width="column.minWidth"
                             :class-name="column.columnClass"
                             :fixed="column.fixPosition ? column.fixPosition : false"
                             :label="column.label" :sortable="column.sortable"
                             :show-overflow-tooltip="column.overflow">
                <template slot-scope="scope" v-if="!column.subCol">
                    <slot name="edit" v-if="column.isSlot" :rowData="scope" :columnConfig="column"></slot>
                    <!--输入字符串-->
                    <el-input v-if="column.isInput === 'text'" v-model="scope.row[column.prop]" size="mini"
                              :disabled="options.isDisableEdit"
                              @change="changeProgramNum(scope.$index, scope.row[column.prop])">
                        <template v-if="column.inputPrepend" slot="prepend"></template>
                        <template v-if="column.inputAppend" slot="append">{{column.inputAppend}}</template>
                    </el-input>
                    <!--输入数字排序-->
                    <el-input-number v-if="column.isInput === 'number'" v-model="scope.row[column.prop]" size="mini"
                                     :disabled="options.sharedTableData && (scope.$index >= options.sharedTableData.length)"
                                     :min="1" :max="999" :controls="false" class="w-100"
                                     @blur="changeOrder(scope.$index, scope.row[column.prop], column.prop)"></el-input-number>

                    <!--视频、音频预览-->
                    <!--此处需限制接口传递的参数值。1代表图片；2代表文本；3、4代表视频和音频-->
                    <el-button v-if="(column.isVideo && scope.row[column.prop]) ||
                     (column.isMultipleFormat && (scope.row[column.formatCol] === '3' || scope.row[column.formatCol] === '4'))"
                               type="primary" round icon="el-icon-caret-right" size="mini"
                               @click.stop="playVideo(scope.row[column.prop], column.videoParams, scope.row[column.formatCol])">
                        预览
                    </el-button>
                    <!--自定义按钮-->
                    <el-button v-if="column.isGeneralButton && scope.row[column.prop]"
                               :type="column.type" round :icon="column.icon" size="mini"
                               @click="emitCustom(scope.row, column)">
                        {{column.buttonText || scope.row[column.prop]}}
                    </el-button>
                    <span v-if="column.isUrlButton">
                        <el-button v-for="(item, key) in scope.row[column.prop]"
                                   type="text" :key="key" @click="emitUrlJump(scope.row, column, item)">
                            {{item[column.urlText]}}
                        </el-button>
                    </span>
                    <!--图片预览-->
                    <el-tooltip v-if="(column.imageW && scope.row[column.prop]) ||
                     (column.isMultipleFormat && scope.row[column.formatCol] === '1')" placement="right">
                        <div slot="content">
                            <img referrerpolicy="no-referrer" :src="scope.row[column.prop]"
                                 :width="column.imageW || 300" class="img-height" alt="此图不存在，请检查url"/>
                        </div>
                        <el-button type="primary" size="mini">预览</el-button>
                    </el-tooltip>
                    <el-tooltip v-if="column.isUrl && scope.row[column.prop]" placement="top"
                                :content="scope.row[column.prop]">
                        <el-button @click="openUrl(scope.row[column.prop])"
                                   type="text">{{column.label}}
                        </el-button>
                    </el-tooltip>
                    <el-tooltip v-if="column.isText && scope.row[column.prop]" placement="top">
                        <div slot="content">
                            <div v-for="(item, key) in scope.row[column.prop]" :key="key">
                                {{key + ':' + item}}
                            </div>
                        </div>
                        <el-button type="primary" size="mini">查看</el-button>
                    </el-tooltip>
                    <!-- 自定义html -->
                    <span v-if="column.isMultiCell" v-html="column.render(scope)"></span>

                    <!--文字输出-->
                    <span v-if="(column.isMultipleFormat && scope.row[column.formatCol] === '2') ||
                     !(column.isInput || column.isMultiCell || column.isVideo || column.imageW || column.isText
                     || column.isMultipleFormat || column.isGeneralButton || column.isUrl
                      || column.isUrlButton || column.linkTo || column.isSlot)">
                        {{scope.row[column.prop] | formatCol(column.formatter)}}</span>
                </template>

                <!--跨列表格-->
                <el-table-column v-for="(item, subKey) in column.subCol" :key="subKey" :width="item.width"
                                 :label="item.label"
                                 :type="item.isExpand ? 'expand' : ''">
                    <template slot-scope="subScope">
                        <slot name="span-cols" :rowData="subScope" :item="item" v-if="!column.isDiffFormat"></slot>
                        <!--diff显示-->
                        <ul v-if="column.isDiffFormat" class="list-group list-group-flush text-center">
                            <li v-for="(diffVal, diffKey) in getDiffData(subScope.row[item.prop], subScope.row[item.formatCol], item.isExpand)"
                                :key="diffKey" class="list-group-item">
                                <span class="text-primary">{{diffKey}}: </span>
                                <span v-html="diffVal"></span>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table-column>

            <!--表格详情下拉栏-->
            <el-table-column :width="options.detailW || 50" :label="options.detailLabel || '详情'" type="expand"
                             v-if="detailColumns">
                <template slot-scope="scope">
                    <el-form   v-if="detailColumns.length !== 0"  inline class="card-content" :label-width="options.detailLW ? options.detailLW + 'px' : '120px'">
                        <div  v-if="!options.detailStyle">
                            <el-form-item  v-for="(column, key) in detailColumns" :class="{half:column.halfWidth}"
                                           :key="key" :label="column.label + '：'">
                                <!-- 合并单元格 -->
                                <span v-if="column.isMultiCell" v-html="column.render(scope)"></span>
                                <span
                                    v-else>{{ scope.row[column.prop] | arr2Str(column.formatMap, column.showKey)}}</span>
                            </el-form-item>
                        </div>
                        <!-- 例子在interfereList中 -->
                        <div v-if="options.detailStyle === 'nested'">
                            <el-form-item v-for="(item, key) in scope.row[detailColumns[0].prop]"
                                          :key="key" :label="item.label + '：'">{{ item.val}}
                            </el-form-item>
                        </div>
                    </el-form>
                    <span
                        v-show="(options.detailStyle === 'nested') && (scope.row[detailColumns[0].prop].length < 1)">空</span>
                </template>
            </el-table-column>

            <!--操作栏-->
            <el-table-column :width="options.opW || 130" label="操作" v-if="!options.noOperation"
                             :fixed="options.opFixed">
                <template slot-scope="scope">
                    <slot name="op-buttons" :rowData="scope"></slot>
                    <!--删除按钮-->
                    <el-button v-if="showDelBtn(scope.$index, scope.row)" @click="handleDel(scope.$index, scope.row)"
                               type="text">
                        <i v-if="!options.delTip" class="el-icon-delete"></i>{{ options.delTip || '' }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="!options.noPagination" background @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       class="pagination" layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="options.pageSizes || [15, 20, 25, 50, 100, 500]"
                       :page-size="pageSize" :total="totalSize"></el-pagination>

        <!--视频、音频播放-->
        <el-dialog title="播放" :visible="showVideo" @close="closeVideo" width="900px" :modal="false">
            <h6 class="video-title">资源URL为：<a :href="currentVideo" target="_blank"
                                              class="text-info">{{currentVideo}}</a></h6>
            <video ref="video" :src="currentVideo" autoplay controls width="100%" rel="noreferrer"></video>
        </el-dialog>
    </div>
</template>

<script>
    import DiffMatchPatch from 'diff-match-patch';
    const localService = {
        get() {
            return new Promise((resolve, reject) => {
                resolve({
                    data: {
                        code: 0,
                        data: {
                            total_count: 0,
                            list: []
                        }
                    }
                });
            });
        }
    };

    DiffMatchPatch.DIFF_DELETE = -1;
    DiffMatchPatch.DIFF_INSERT = 1;
    DiffMatchPatch.DIFF_EQUAL = 0;
    const diffUntil = new DiffMatchPatch();

    // 跟后端数据库关键字对齐
    const sortMap = {
        'ascending': 'asc',
        'descending': 'desc'
    };

    /**
     * 将epoch time转换为中国时间格式
     * @param val: number or string
     * @returns {string}
     * @constructor
     */
    function dtFormat(val, headTime) {
        if (!val) {
            return '';
        }
        let tempDateFormatter = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: 'Asia/Shanghai'
        };
        if (headTime) {
            tempDateFormatter = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                timeZone: 'Asia/Shanghai'
            };
        }
        let tempDate = new Date(val);
        /* eslint-disable new-cap */
        return Intl.DateTimeFormat('zh-Hans-CN', tempDateFormatter).format(tempDate);
        /* eslint-enable new-cap */
    }

    function parseJSON(jsonStr) {
        if (jsonStr.indexOf('{') > -1) {
            return JSON.parse(jsonStr);
        }

        return {};
    }

    export default {
        name: "common-list",
        props: ['service', 'searchColumns', 'tableColumns', 'detailColumns', 'options', 'defineRowClass', 'isTeacher', 'defaultSearchColumns', 'serviceAdapter'],
        data() {
            return {
                showVideo: false,
                isLoadingList: false,
                currentVideo: '#',
                // 根据情景，指向不同的service
                currentService: null,

                searchForm: {},
                tableData: [],
                // 暂存数据用
                tempTableData: [],
                totalSize: 0,
                pageSize: this.options.pageSize || 20,
                currentPage: 1,
                rules: {},
                settingSearch: [],
                settingSearchColumns: [], // 查询配置
                el: '',
                tableHeight: 0
            };
        },
        created: function () {
            // 切换service
            if (this.serviceAdapter[this.service]) {
                this.currentService = this.serviceAdapter[this.service];
            } else {
                this.currentService = localService;
            }
            if (this.formatedSearchColumns) {
                this.formatedSearchColumns.forEach(item => {
                    if (item.defaultVal) {
                        this.$set(this.searchForm, item.prop, item.defaultVal);
                    } else {
                        this.$set(this.searchForm, item.prop, '');
                    }
                });
            }
            this.initSearchConfig();
        },
        mounted() {
            if (!this.options.manualRequest) {
                this.getTableData();
            }
        },
        watch: {
            'options.sharedTableData': function (val) {
                this.tableData = val.concat(this.tempTableData);
                if (this.options.customSpan) {
                    let spanArr = this.handleCustomSpan(this.tableData, this.options.customSpan);
                    this.tableData.forEach((item, index) => {
                        Object.assign(item, spanArr[index]);
                    });
                }
            },
            'options.activeTab': function (val) {
                this.$refs.table.doLayout();
            },
            'options.sharedSearchSelection': function (val) {
                Object.assign(this.searchForm, this.options.sharedSearchSelection);
                this.getTableData();
            },
            // 父组件出发查询form更新
            'options.searchUpdate': function () {
                this.$refs['searchForm'].resetFields();
            },
            // 有父组件触发的列表更新
            'options.startUpdate': function (val) {
                this.getTableData();
            },
            'options.startGetSearchForm': function (val) {
                this.$emit('getSearchFormData', this.searchForm);
            },
            'options.tableHeight': {
                handler: function (val) {
                    this.changeTableHeight(val);
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            // format searchColumns to array
            formatedSearchColumns() {
                let tempSearchCol = this.searchColumns;
                // 兼容如果是object，则转成数组
                if (Object.prototype.toString.call(tempSearchCol) === '[object Object]') {
                    let searchKeys = this.defaultSearchColumns || Object.keys(tempSearchCol); //
                    tempSearchCol = searchKeys.map(key => {
                        return tempSearchCol[key];
                    });
                }
                if (tempSearchCol) {
                    tempSearchCol = tempSearchCol.concat(this.settingSearch.map(item => this.searchColumns[item]));
                }
                return tempSearchCol;
            },
            tempSearchColumns: function () {
                let relatedColPos = this.formatedSearchColumns ? this.formatedSearchColumns.filter(item => item.relatedCols).map(item => item.prop) : '';
                if (relatedColPos && this.formatedSearchColumns) {
                    if (Array.isArray(relatedColPos)) {
                        let tempCol = [];
                        let allTempCol = [];
                        // this.searchColumns 是Object
                        let temp = {};
                        if (Object.prototype.toString.call(this.searchColumns) === '[object Array]') {
                            this.searchColumns.forEach(item => {
                                temp[item.prop] = item;
                            });
                        } else {
                            temp = this.searchColumns;
                        }
                        Object.keys(temp).filter(item => {
                            return relatedColPos.includes(temp[item].prop);
                        }).forEach(item => {
                            let col = temp[item];
                            let tempVal = this.searchForm[item] + '';
                            if (tempVal) {
                                tempCol = tempCol.concat(col.relatedCols[tempVal]);
                            }
                            allTempCol = allTempCol.concat(col.relatedCols['all']);
                        });
                        return this.formatedSearchColumns.filter(col => {
                            return !allTempCol.includes(col.prop) || tempCol.includes(col.prop);
                        });
                    } else {
                        let tempCol = this.searchColumns[relatedColPos];
                        // 转为字符串，防止出现0 == false的情况
                        let tempVal = this.searchForm[tempCol.prop] + '';
                        return this.formatedSearchColumns.filter(col => {
                            return !(tempCol.relatedCols['all'].includes(col.prop) && !(tempVal && tempCol.relatedCols[tempVal].includes(col.prop)));
                        });
                    }
                }
                return this.formatedSearchColumns;
            }
        },
        filters: {
            arr2Str: function (val, formatMap, showKeyArr) {
                if (val) {
                    if (Array.isArray(val)) {
                        switch (typeof val[0]) {
                            case 'undefined':
                                return '';
                            case 'string':
                                return val.join('; ');
                            case 'object':
                                let result = '';
                                // 默认为['prop', 'name']
                                let keyArr = showKeyArr || Object.keys(val[0]);
                                val.forEach(item => {
                                    let tempResult = [];
                                    keyArr.forEach(key => {
                                        tempResult.push(item[key]);
                                    });
                                    result += tempResult.join(' : ') + '; ';
                                });

                                return result;
                        }
                    } else {
                        if (formatMap) {
                            switch (formatMap) {
                                case 'transTime1000':
                                    return dtFormat(Number(val) * 1000);
                                default:
                                    return formatMap[val];
                            }
                        } else {
                            return val;
                        }
                    }
                }
                return '';
            },
            // formatter总入口
            formatCol(val, indicator) {
                let result = val;
                if (val || val === 0) {
                    switch (indicator) {
                        // 状态转换
                        case 'statusMap':
                            result = val.name || val.prop;
                            break;
                        // 时间转换
                        case 'transTime':
                            result = dtFormat(val);
                            break;
                        // 时间转换
                        case 'transTime1000':
                            result = dtFormat(Number(val) * 1000);
                            break;
                        // 时间转换
                        case 'transDuration':
                            result = (val / 1000) + '秒';
                            break;
                        // 时间范围
                        case 'timeArr':
                            if (Array.isArray(val[0])) {
                                result = val[0].map(time => dtFormat(Date.parse(time))).join(' - ');
                            } else if (val.length === 2) {
                                result = val.map(time => dtFormat(Date.parse(time))).join(' - ');
                            } else {
                                result = '';
                            }
                            break;
                        // 年月日时间区间格式转换
                        case 'transDateArr':
                            result = val.map(time => dtFormat(Date.parse(time), true)).join(' - ');
                            break;
                        // 数组转换
                        case 'transArr':
                            if (val.length === 0) {
                                result = '-';
                            } else {
                                result = '';
                                for (let item of val) {
                                    if (typeof item === 'string') {
                                        result += item + ';';
                                    } else if (Object.prototype.toString.call(item) === '[object Object]') {
                                        result += item.name + ';';
                                    }
                                }
                            }
                            break;

                        // 时间转换
                        case 'console':
                            break;
                        case 'hourMin':
                            let h = Math.floor(Number(val) / 60);
                            let min = Math.round(Number(val) % 60);
                            if (h === 0) {
                                result = min + '分钟';
                            } else {
                                result = h + '小时' + min + '分钟';
                            }
                            break;
                        case 'minSecond': // 秒 => m's''格式
                            let m = Math.floor(Number(val) / 1000 / 60);
                            let sec = Math.round(Number(val) / 1000 % 60);
                            if (m === 0) {
                                result = sec + '\'';
                            } else {
                                result = m + '\'\'' + sec + '\'';
                            }
                            break;
                    }
                } else {
                    result = '-';
                }

                return result;
            }
        },
        methods: {
            handleCustomSpan(dataArr, spanProp) {
                // 生成Span数组
                let tempSpanArr = [];
                let tempSpanID = {
                    index: '',
                    val: ''
                };
                dataArr.forEach((item, index) => {
                    if (tempSpanID.val === item[spanProp]) {
                        tempSpanArr[tempSpanID.index].rowSpan++;
                        tempSpanArr.push({
                            rowSpan: 0,
                            colSpan: 0
                        });
                    } else {
                        Object.assign(tempSpanID, {
                            index: index,
                            val: item[spanProp]
                        });
                        tempSpanArr.push({
                            rowSpan: 1,
                            colSpan: 1
                        });
                    }
                });

                return tempSpanArr;
            },
            getTableData: function () {
                // 先初始化数据
                this.tableData = [];
                this.isLoadingList = true;
                /**
                 * @getParams 为请求时的额外参数，由父组件指定
                 */
                this.currentService.get(this.currentPage, this.pageSize, this.searchForm, this.options.getParams).then(res => {
                    if (res && res.data.code === 0) {
                        this.tempTableData = res.data.data.list;

                        if (this.options.sharedTableData) {
                            this.tableData = this.options.sharedTableData.concat(res.data.data.list);
                        } else {
                            if (this.options.customSpan) {
                                let spanArr = this.handleCustomSpan(this.tempTableData, this.options.customSpan);
                                this.tableData = this.tempTableData.map((item, index) => {
                                    return Object.assign(item, spanArr[index]);
                                });
                            } else {
                                this.tableData = res.data.data.list;
                            }
                        }

                        this.totalSize = res.data.data.total_count;
                        this.$emit('getData', res.data.data);
                    } else {
                        // 前端mock数据,暂用
                        this.tableData = [];
                        this.tempTableData = [];
                        this.totalSize = 0;
                        // this.tableData = res.data;
                        // this.tempTableData = res.data;
                        // this.totalSize = res.data.total;
                    }
                    this.isLoadingList = false;
                });
            },
            operatorEvent(e) {
                this.$emit('operatorEvent', e);
            },
            searchData() {
                // 暂时假定第一个搜索字段会触发搜索弹出框
                let tempCol = this.formatedSearchColumns[0];
                if (tempCol.triggerDialogOption && tempCol.triggerDialogOption.includes(this.searchForm[tempCol.prop])) {
                    this.$emit('triggerSearchDialog', this.searchForm[tempCol.prop]);
                } else {
                    this.$refs.searchForm.validate(valid => {
                        if (valid) {
                            this.currentPage = 1;
                            this.getTableData();
                        } else {
                            return false;
                        }
                    });
                }
                // 增加查询监听
                this.$emit('triggerSearch');
            },
            handleSizeChange: function (val) {
                this.pageSize = val;
                this.getTableData();
                this.$emit('paginationChange', this.currentPage, this.pageSize);
            },
            handleCurrentChange: function (val) {
                this.currentPage = val;
                this.getTableData();
                this.$emit('paginationChange', this.currentPage, this.pageSize);
            },
            /**
             * 删除table中的行
             * @param index: 代表第几行
             * @param row: 此行的数据对象
             */
            handleDel(index, row) {
                this.$confirm('是否删除此条内容', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.options.sharedTableData && (index < this.options.sharedTableData.length)) {
                        this.$emit('handleDel', index);
                    } else {
                        // ...
                        let tempID = this.options.delID || 'resource_id';
                        this.currentService.del(row[tempID], this.searchForm, this.options.getParams).then(res => {
                            if (res.data.code === 0) {
                                this.$message({showClose: true, message: '删除成功', type: 'success'});
                                this.getTableData();
                            }
                        });
                    }
                }).catch(() => {
                    // ...
                });
            },
            // 播放音频、视频
            playVideo: function (src, videoParams, formatCol) {
                if (this.options.needRequestUrl) {
                    this.currentService.getVideoUrl(src, videoParams, formatCol).then(res => {
                        if (res.data.code === 0) {
                            this.currentVideo = res.data.data.url;
                        } else {
                            this.currentVideo = '#';
                        }
                    });
                } else {
                    this.currentVideo = src;
                }
                this.showVideo = true;
            },
            closeVideo: function () {
                this.showVideo = false;
                this.$refs['video'].pause();
            },
            // 排序
            changeOrder: function (index, order, prop) {
                let tempOder;
                if (order > this.options.sharedTableData.length) {
                    tempOder = this.options.sharedTableData.length - 1;
                } else {
                    tempOder = Number(order) - 1;
                }
                let tempData = this.options.sharedTableData.splice(index, 1);
                this.options.sharedTableData.splice(tempOder, 0, tempData[0]);
                this.$nextTick(function () {
                    this.options.sharedTableData.forEach((val, i) => {
                        this.$set(val, prop, i + 1);
                    });
                });
            },
            changeProgramNum(index, val) {
                if (this.options.submitInput) {
                    this.$emit('refreshInput', this.tableData, index);
                } else {
                    this.tableData[index].order = this.tableData[index].trim().replace(/\s*，\s*/g, ',').split(',').sort().join(',');
                    this.tableData.sort((a, b) => {
                        return a.order <= b.order ? -1 : 1;
                    });
                }
            },
            handleInput(val) {
                this.$emit('inputChange', val);
            },
            handleSelection(val) {
                this.$emit('selectionChange', val);
            },
            handleSingleSelect(val, oldVal) {
                this.$emit('currentChange', val, oldVal);
            },
            handleChange(column) {
                // 选择某一项时，触发请求，填补另一选择框的options
                if (column.selectEvent) {
                    this.$emit(column.selectEvent, this.searchForm[column.prop], column.prop);
                    if (column.clearCol) {
                        if (column.defaultVal) {
                            this.$set(this.searchForm, column.clearCol, column.defaultVal);
                        } else {
                            this.$set(this.searchForm, column.clearCol, '');
                        }
                    }
                }
                // 当选择某一项时，由于筛选字段太多，就弹出筛选框
                if (column.triggerDialogOption && column.triggerDialogOption.includes(this.searchForm[column.prop])) {
                    this.$emit('triggerSearchDialog', this.searchForm[column.prop]);
                }
                // 当存在relatedSearchColPos时，切换选项，自动清除相关字段
                let relatedColPos = this.options.relatedSearchColPos;
                if (relatedColPos && column.relatedCols) {
                    if (Array.isArray(relatedColPos)) {
                        if (relatedColPos.find(item => {
                            return item === column.prop;
                        })) {
                            column.relatedCols['all'].forEach(relatedProp => {
                                this.$set(this.searchForm, relatedProp, '');
                            });
                        }
                    } else {
                        column.relatedCols['all'].forEach(relatedProp => {
                            this.$set(this.searchForm, relatedProp, '');
                        });
                    }
                }
            },
            showDelBtn(index, row) {
                let result = false;
                let delProp = this.options.delProp || 'status';
                if (this.options.showDelStatus) {
                    let status = (typeof row[delProp] === 'object') ? row[delProp].prop : row[delProp];
                    result = this.options.showDelStatus.includes(status);
                } else {
                    result = !((this.service === 'music-list') && (index < this.options.sharedTableData.length));
                }

                return !this.options.noDel && result;
            },
            sortColumn(dataObj) {
                // todo-tao element-ui有bug，所以暂时采取这种方法，将来优化
                if (dataObj.column) {
                    this.$emit('sortColumn', dataObj.column.label, sortMap[dataObj.order]);
                } else {
                    // 当取消排序时
                    this.$emit('sortColumn', 'cancel');
                }
            },
            getDiffData(oldVal, newVal, showAllCol) {
                let temOldVal = parseJSON(oldVal);
                let temNewVal = parseJSON(newVal);
                let resultObj = {};
                for (let key in temNewVal) {
                    if (temNewVal.hasOwnProperty(key)) {
                        let tempDiff = diffUntil.diff_main(temOldVal[key] ? temOldVal[key] + '' : '',
                            temNewVal[key] ? temNewVal[key] + '' : '');
                        diffUntil.diff_cleanupSemantic(tempDiff);
                        if (showAllCol) {
                            resultObj[key] = diffUntil.diff_prettyHtml(tempDiff);
                        } else {
                            if (diffUntil.diff_levenshtein(tempDiff) !== 0) {
                                resultObj[key] = diffUntil.diff_prettyHtml(tempDiff);
                            }
                        }
                    }
                }

                return resultObj;
            },
            // 获取导出链接
            downloadLists(url) {
                let searchParams = Object.assign({
                    page: this.currentPage,
                    page_size: this.pageSize
                }, this.searchForm);
                let searchParamsArr = [];
                Object.keys(searchParams).forEach(key => {
                    let value = searchParams[key];
                    if (typeof value === 'object') {
                        value = encodeURIComponent(JSON.stringify(value));
                    }
                    searchParamsArr.push(`${key}=${value}`);
                });
                let paramArr = [];
                Object.keys(this.options.getParams).forEach(key => {
                    if (key !== 'action') {
                        let value = this.options.getParams[key];
                        if (typeof value === 'object') {
                            value = encodeURIComponent(JSON.stringify(value));
                        }
                        paramArr.push(`${key}=${value}`);
                    }
                });
                let currentDownloadUrl = url || this.options.downloadUrl;
                // 如果传入的url带有查询字段
                if (/.+\?.+/.test(currentDownloadUrl)) {
                    currentDownloadUrl = `${currentDownloadUrl}&${searchParamsArr.join('&')}&${paramArr.join('&')}`;
                } else {
                    currentDownloadUrl = `${currentDownloadUrl}?${searchParamsArr.join('&')}&${paramArr.join('&')}`;
                }
                window.location.href = currentDownloadUrl;
                this.$emit('downloadList');
            },
            // row, column, rowIndex, columnIndex, 只把第一列跨行、列
            spanMethod(paramObj) {
                let rowSpan = 1;
                let colSpan = 1;

                let spanColumnIndex = this.tableColumns.findIndex(column => {
                    return column.prop === this.options.customSpan;
                });
                if (this.options.canCheck || this.options.hasIndex) {
                    spanColumnIndex++;
                }

                if (this.options.customSpan && (paramObj.columnIndex === spanColumnIndex)) {
                    rowSpan = paramObj.row.rowSpan;
                    colSpan = paramObj.row.colSpan;
                }
                return {
                    rowspan: rowSpan,
                    colspan: colSpan
                };
            },
            tableRowClassName({row, rowIndex}) {
                if (this.defineRowClass) {
                    return this.defineRowClass(row, rowIndex);
                } else {
                    return '';
                }
            },
            /**
             * 远程查询
             * @param args 数组第一个参数为keywords 第二个参数为该属性prop
             */
            searchRemote(query, prop) {
                this.$emit('searchRemote', query, prop);
            },
            /**
             * 触发外部自定义事件
             * @param rowData: 表格当前行数据
             * @param columnData: 表格自定义列配置
             */
            emitCustom(rowData, columnData) {
                this.$emit('customClickEvent', rowData, columnData);
            },
            /**
             * 触发外部自定义事件
             * @param row: 表格当前行数据
             * @param col: 表格自定义列配置
             * @param item: 遍历的当前btn
             */
            emitUrlJump(row, col, item) {
                this.$emit('getJumpUrl', row, col, item);
            },
            /**
             * 配置查询
             */
            settingSearchCols(e) {
                let parentColumns = this.settingSearchColumns.filter(item => {
                    return this.searchColumns[item.prop].relatedCols;
                });
                parentColumns.forEach(item => {
                    let relatedCols = this.searchColumns[item.prop].relatedCols['all'];
                    if (this.settingSearch.includes(item.prop) && !this.settingSearch.includes(relatedCols[0])) { // 如果包含关联项
                        this.settingSearch = this.settingSearch.concat(relatedCols);
                    }
                });
            },
            /**
             * 初始化查询配置项
             * 只要是不在默认查询中的均在配置查询中
             * 默认status为未选中
             **/
            initSearchConfig() {
                let arr = [];
                if (this.defaultSearchColumns) {
                    for (let key in this.searchColumns) {
                        if (!this.defaultSearchColumns.includes(key) && !this.searchColumns[key].isChild) {
                            let obj = this.searchColumns[key];
                            this.settingSearchColumns.push({
                                label: obj.label,
                                prop: obj.prop,
                                status: false
                            });
                        }
                    }
                }
                return arr;
            },
            /**
             * 点击跳转
             */
            openUrl(url) {
                if (url) {
                    window.open(url);
                }
            },
            changeTableHeight(val) {
                this.$nextTick(() => {
                    this.el = this.$refs['table'].$el;
                    switch (val) {
                        case 'table':
                            let tableTotal = this.el.offsetParent.offsetTop + this.el.offsetTop + this.el.nextElementSibling.offsetHeight + 10;
                            this.tableHeight = window.innerHeight - tableTotal;
                            break;
                        case 'tabTable':
                            let total = this.el.offsetTop + this.el.offsetParent.offsetTop + this.el.nextElementSibling.offsetHeight + 27;
                            this.tableHeight = window.innerHeight - total;
                            break;
                        case 'noPage':
                            let Pagetotal = this.el.offsetParent.offsetTop + this.el.offsetTop;
                            this.tableHeight = window.innerHeight - Pagetotal;
                            break;
                        default:
                            this.tableHeight = this.options.tableHeight;
                            break;
                    }
                });
            }
        }
    };
</script>

<style lang="less">
    .common-list-wrap {
        table {
            border-collapse: separate;
        }

        .el-table th {
            color: rgba(0, 0, 0, 0.85);
            font-weight: bold;
            background-color: #fafafa;
            padding: 0px 0;
        }

        .el-table th,
        .el-table td {
            text-align: center;
            font-size: 12px;
            padding: 0px;
        }
        .el-table .cell {
            line-height: 40px;
        }
        .pagination {
            margin-top: 10px;
            justify-content: flex-end;
        }
        .el-input__inner {
            border-radius: 1px;
        }
        .md-select {
            width: 120px;
        }
        .ld-select {
            width: 180px;
        }
        .md-date-pick {
            width: 220px;
        }
        .card-content {
            font-size: 0;
            text-align: left;
        }
        .card-content label {
            width: 120px;
            color: #99a9bf;
        }
        .card-content .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 100%;
        }
        .card-content .half {
            width: 50%;
        }
        .el-dialog__body {
            padding-top: 10px;
        }
        .pop-btn-wrap > button {
            margin-bottom: 8px;
        }
        .el-form-item__label {
            margin-bottom: 0;
            font-size: 12px;
        }
        .reset-cell { // 重置单元格样式
            height: 100%;
            vertical-align: top !important;;
            text-align: left !important;
        }
    }
</style>
<style scoped lang="less">
    .img-height {
        min-height: 30px;
    }

    .video-title {
        max-width: 100%;
    }

    .download-all {
        margin-right: 20px;
    }
</style>
<style>
    /* 解决transfer的bug */
    .el-checkbox.el-transfer-panel__item {
        z-index: 0;
    }
</style>
