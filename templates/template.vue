<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- ${
        settings.filters.map(filter => {
          let model = '';
          let placeholder = '';
          let formItem = null;
          if(typeof filter === "string") {
            model = filter;
            const column = settings.columns.find(item => {
              return item.model === model;
            });
            formItem = column.formItem;
          }else {
            model = filter.model;
            formItem = filter;
          }
          
          if(formItem.type === 'select') {
            return `<el-select v-model="query.${model}" placeholder="${formItem.placeholder}">`
                + 
                formItem.options.map(option => {
                  return `<el-option label="${option.label}" value="${option.value}"></el-option>`
                }).join("")
                +
              `</el-select>`
          }
          return `<el-input v-model="query.${model}" placeholder="${formItem.placeholder}" class="filter-item" style="width: ${formItem.width || '200px'};"></el-input>`
        }).join("")
      } -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        创建
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
      <el-select
        v-model="selectedFields"
        multiple
        clearable
        collapse-tags
        class="filter-item"
        placeholder="请选择列"
      >
        <el-option
          v-for="item in fields"
          :key="item.value"
          :label="item.label"
          :value="item.name"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      stripe
      style="width: 100%"
      @sort-change="sortChanged"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="row-expand">
            <!-- ${
              settings.columns.map(column => {
                if(column.type === 'rate') {
                  return `<el-form-item label="${column.label}">
                    <svg-icon v-for="n in + props.row.${column.model}" :key="n" icon-class="star" class="meta-item__icon" />
                  </el-form-item>`
                }
                return `<el-form-item label="${column.label}">
                  <span>{{ props.row.${column.model} }}</span>
                </el-form-item>`
              }).join("")
            } -->
          </el-form>
        </template>
      </el-table-column>
      <!-- ${
          settings.columns.map(column => {
            if(column.type === 'rate') {
              return `<el-table-column label="${column.label}" width="${column.width || 180}">
                <template slot-scope="{row}">
                  <svg-icon v-for="n in + row.${column.model}" :key="n" icon-class="star" class="meta-item__icon" />
                </template>
              </el-table-column>`
            }
            let sortable = '';
            if(column.sortable) {
              sortable = 'sortable="custom"'
            } 
            return `<el-table-column
                prop="${column.model}"
                label="${column.label}"
                ${sortable}
                width="${column.width || 180}"
              >
              </el-table-column>`
          }).join("")
      } -->
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
      class="pagination-margin"
    ></el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- ${
          settings.columns.map(column => {
            const formItem = column.formItem;
            if(!formItem) {
              return ""
            }
            const rules = formItem.rules ? `:rules='${JSON.stringify(formItem.rules)}'` : '';
            if(formItem.type === 'select') {
              return `<el-form-item label="${column.label}" prop="${column.model}" ${rules}>
                <el-select v-model="temp.${column.model}" placeholder="${formItem.placeholder}">`
                  + 
                  formItem.options.map(option => {
                    return `<el-option label="${option.label}" value="${option.value}" />`
                  }).join("")
                  +
                `</el-select>
              </el-form-item>`
            } else if (formItem.type === 'rate') {
              return `<el-form-item label="${column.label}">
                <el-rate v-model="temp.${column.model}" :colors='${formItem.colors ? JSON.stringify(formItem.colors) : ["#99A9BF", "#F7BA2A", "#FF9900"]}' :max="${formItem.max ? formItem.max : 5}" style="margin-top:8px;" />
              </el-form-item>`
            }
            return `<el-form-item label="${column.label}" prop="${column.model}" ${rules}>
              <el-input v-model="temp.${column.model}" placeholder="${formItem.placeholder}" />
            </el-form-item>`
          }).join("")
        } -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
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
      /* ${
        const mapChangeObj = (map) => {
          let obj = {};
          for(let [k,v] of map) {
            console.log('k', k, 'v', v)
            obj[k] = v;
          }
          return obj;
        }
        const getDefaultByType = function(type) {
          switch(type) {
            case "text":
              return "";
            case "bool":
              return false;
            default:
              return 0;    
          }
        }
        let tempMap = new Map(settings.columns.map(column => {
          const defaultValue = column.formItem && column.formItem.defaultValue ? column.formItem.defaultValue : getDefaultByType(column.type)
          return [column.model, defaultValue]
        }));
        console.log('tempMap', tempMap);
        let tempObj = mapChangeObj(tempMap);
        console.log('tempObj', tempObj);
        `selectedFields: ${
          JSON.stringify(settings.columns.map(column => {
            return column.model;
          }))
        },
        fields: ${
          JSON.stringify(settings.columns.map(column => {
            return {
              name: column.model,
              label: column.label
            };
          }))
        },
        temp: ${
          JSON.stringify(tempObj)
        },`
      } */
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
      /* ${
        const query = {
          page: 1,
          size: 10,
          sort: ""
        };
        console.log('settings.filters', settings.filters);
        for(let filter of settings.filters) {
          if(typeof filter === "string"){
            query[filter] = ""
          }else{
            query[filter.model] = ""
          }
        }
        `query: ${JSON.stringify(query)}`
      } */
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
        /* ${
          `_axios.get("/api/${settings.name}/delete", { id }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.getData();
          });`
        } */
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
          /* ${
            `XLSX.utils.book_append_sheet(wb, ws, "${settings.label}");
            XLSX.writeFile(wb, "${settings.label}.xlsx");`
          } */
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
          /* ${
            `_axios.post("/api/${settings.name}/add", this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: "创建成功",
                type: "success",
                duration: 2000
              });
              this.getData();
            });`
          } */
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
          /* ${
            `_axios.post("/api/${settings.name}/update", tempData).then(() => {
              this.dialogFormVisible = false;
              this.$message({
                message: "更新成功",
                type: "success",
                duration: 2000
              });
              this.getData();
            });`
          } */
        }
      });
    },
    handleFilter() {
      this.query.page = 1;
      this.getData();
    },
    sortChanged({ column, prop, order }) {
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
      /* ${
        `_axios.get("/api/${settings.name}/queryAll", this.query).then(res => {
          this.data = res.data;
          this.total = res.total;
          const totalPageSize = Math.ceil(this.total / this.query.size) || 1;
          if (this.query.page > totalPageSize) {
            this.query.page = this.query.page - 1;
            this.getData();
          } else {
            this.loading = false;
          }
        });`
      } */
    }
  },
  created() {
    this.getData();
  }
};
</script>
