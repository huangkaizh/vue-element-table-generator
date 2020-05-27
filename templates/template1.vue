<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="query.columnA" placeholder="请选择列A">
        <el-option label="选项A" value="optionA" />
        <el-option label="选项B" value="optionB" />
      </el-select>
      <el-select v-model="query.columnB" placeholder="请选择字段B">
        <el-option label="1" value="1" />
        <el-option label="2" value="2" />
        <el-option label="3" value="3" />
        <el-option label="4" value="4" />
        <el-option label="5" value="5" />
      </el-select>
      <el-input
        v-model="query.name"
        placeholder="名字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"></el-input>
      <el-input
        v-model="query.age"
        placeholder="年龄"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"></el-input>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">
        创建
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload">
        导出
      </el-button>
      <el-select
        v-model="selectedFields"
        multiple
        clearable
        collapse-tags
        class="filter-item"
        placeholder="请选择列">
        <el-option
          v-for="item in fields"
          :key="item.value"
          :label="item.label"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      stripe
      style="width: 100%"
      @sort-change="sortChanged">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="row-expand">
            <el-form-item label="列A">
              <span>{{ props.row.columnA }}</span>
            </el-form-item>
            <el-form-item label="字段B">
              <svg-icon v-for="n in + props.row.columnB" :key="n" icon-class="star"
                class="meta-item__icon" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="columnA"
        label="列A"
        sortable="custom"
        width="200">
      </el-table-column>
      <el-table-column label="字段B" width="180">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.columnB" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 0"
      :total="total"
      :current-page.sync="query.page"
      :page-size.sync="query.size"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="getData"
      @size-change="getData"
      class="pagination-margin"></el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="列A" prop="columnA" :rules='[{"required":true,"message":"请选择列A","trigger":"change"}]'>
          <el-select v-model="temp.columnA" placeholder="请选择列A">
            <el-option label="选项A" value="optionA" />
            <el-option label="选项B" value="optionB" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段B">
          <el-rate v-model="temp.columnB" :colors='["#99A9BF","#F7BA2A","#FF9900"]'
            :max="5" style="margin-top:8px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  module.exports = {
    data() {
      return {
        selectedFields: ["columnA", "columnB"],
        fields: [{
          "name": "columnA",
          "label": "列A"
        }, {
          "name": "columnB",
          "label": "字段B"
        }],
        temp: {
          "columnA": "optionA",
          "columnB": 0
        },
        downloadLoading: false,
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "编辑",
          create: "创建"
        },
        loading: false,
        data: [],
        total: 0,
        pageSizes: [10, 15, 20, 30, 50, 100],
        query: {
          "page": 1,
          "size": 10,
          "sort": "",
          "columnA": "",
          "columnB": ""
        }
      };
    },
    methods: {
      handleDelete(id) {
        this.$confirm("将删除此记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          _axios.get("/api/tableA/delete", {
            id
          }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getData();
          });
        });
      },
      jsonArrayToAoa(jsonArray) {
        if (!jsonArray || jsonArray.length === 0) {
          return [];
        }
        const fieldNames = this.fields.map(field => {
          return field.name;
        });
        const fieldLabels = this.fields.map(field => {
          return field.label;
        });
        const aoa = jsonArray.map(json => {
          return fieldNames.map(fieldName => {
            return json[fieldName];
          });
        });
        aoa.unshift(fieldLabels);
        return aoa;
      },
      handleDownload() {
        this.downloadLoading = true; //https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.4/xlsx.full.min.js
        loadScript("https://unpkg.com/xlsx@0.15.4/dist/xlsx.full.min.js").then(
          () => {
            let wb = XLSX.utils.book_new();
            const aoa = this.jsonArrayToAoa(this.data);
            let ws = XLSX.utils.aoa_to_sheet(aoa);
            XLSX.utils.book_append_sheet(wb, ws, "表格A");
            XLSX.writeFile(wb, "表格A.xlsx");
            this.downloadLoading = false;
          }
        );
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: "",
          age: ""
        };
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      createData() {
        console.log("createData");
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            console.log("createData valid: ", valid);
            this.loading = true;
            _axios.post("/api/tableA/add", this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: "创建成功",
                type: "success",
                duration: 2000
              });
              this.getData();
            });
          }
        });
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row); // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp);
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
      },
      updateData() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.loading = true;
            const tempData = Object.assign({}, this.temp);
            _axios.post("/api/tableA/update", tempData).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: "更新成功",
                type: "success",
                duration: 2000
              });
              this.getData();
            });
          }
        });
      },
      handleFilter() {
        this.query.page = 1;
        this.getData();
      },
      sortChanged({
        column,
        prop,
        order
      }) {
        console.log("column, prop, order", column, prop, order);
        if (!order) {
          this.query.sort = "";
          this.handleFilter();
          return;
        }
        const sign = order === "ascending" ? "+" : "-";
        this.query.sort = sign + prop;
        this.handleFilter();
      },
      getData() {
        console.log("user queryAll this.query", this.query);
        this.loading = true;
        _axios.get("/api/tableA/queryAll", this.query).then(res => {
          this.data = res.data;
          this.total = res.total;
          const totalPageSize = Math.ceil(this.total / this.query.size) ||
            1;
          if (this.query.page > totalPageSize) {
            this.query.page = this.query.page - 1;
            this.getData();
          } else {
            this.loading = false;
          }
        });
      }
    },
    created() {
      this.getData();
    }
  };
</script>