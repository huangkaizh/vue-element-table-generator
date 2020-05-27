//handel.js
/*
    数据增删改查模块封装
    req.query 解析GET请求中的参数 包含在路由中每个查询字符串参数属性的对象，如果没有则为{}
    req.params 包含映射到指定的路线“参数”属性的对象,如果有route/user/：name，那么“name”属性可作为req.params.name
    req.body通常用来解析POST请求中的数据
     +req.query.id 可以将id转为整数
 */
// 引入mysql
// var mysql = require("mysql");
const fs = require("fs");
const vueBeautify = require("vue-beautify");
const recast = require("recast");
// 引入mysql连接配置
// var mysqlconfig = require("../../config/mysql");
// 引入连接池配置
// var poolextend = require("../../utils/poolextend");
// // 引入SQL模块
// var sql = require("./sql");
// 引入json模块
var json = require("../../utils/json");
// var parseSort = require("../../utils/parseSort");
// 使用连接池，提升性能
// var pool = mysql.createPool(poolextend({}, mysqlconfig));

String.prototype.render = function(settings) {
  var format = this; //    /\"\$\{(.+)\}\"/

  const replaceCallback = function(matchStr, groupStr) {
    console.log("matchStr", matchStr);
    if (groupStr) {
      const evalResult = eval(groupStr);
      return evalResult;
    }
    return matchStr;
  };

  var result = format.replace(/<!-- \${([^]+?)} -->/g, (matchStr, groupStr) => {
    return replaceCallback(matchStr, groupStr);
  });

  result = result.replace(/\/\* \${([^]+?)} \*\//g, (matchStr, groupStr) => {
    return replaceCallback(matchStr, groupStr);
  });

  return result;
};

function generateRoutes(name, label) {
  const routesFile =
    "D:/frontCode/vue-element-no-npm-demo/src/router/tables.js";
  const routesFileCode = String(fs.readFileSync(routesFile, "utf-8"));
  const ast = recast.parse(routesFileCode);
  const typeBuilders = recast.types.builders;
  const objExp = typeBuilders.objectExpression([
    typeBuilders.property(
      "init",
      typeBuilders.identifier("path"),
      typeBuilders.literal(name)
    ),
    typeBuilders.property(
      "init",
      typeBuilders.identifier("component"),
      typeBuilders.callExpression(typeBuilders.identifier("httpVueLoader"), [
        typeBuilders.literal(`src/pages/tables/${name}.vue`)
      ])
    ),
    typeBuilders.property(
      "init",
      typeBuilders.identifier("name"),
      typeBuilders.literal(name)
    ),
    typeBuilders.property(
      "init",
      typeBuilders.identifier("meta"),
      typeBuilders.objectExpression([
        typeBuilders.property(
          "init",
          typeBuilders.identifier("title"),
          typeBuilders.literal(label)
        ),
        typeBuilders.property(
          "init",
          typeBuilders.identifier("noCache"),
          typeBuilders.literal(true)
        )
      ])
    )
  ]);
  const routesProperties = ast.program.body[1].declarations[0].init.properties;
  if (routesProperties.length > 5) {
    console.log(
      "routesProperties[5].value.elements",
      routesProperties[5].value.elements
    );
    let oldIndex = -1;
    let exist = false;
    for (let element of routesProperties[5].value.elements) {
      oldIndex++;
      exist = element.properties.some((property, index) => {
        const bool =
          property.key.name === "name" && property.value.value === name;
        return bool;
      });
    }
    if (exist) {
      routesProperties[5].value.elements.splice(oldIndex, 1, objExp);
    } else {
      routesProperties[5].value.elements.push(objExp);
    }
  } else {
    routesProperties.push(
      ...[
        typeBuilders.property(
          "init",
          typeBuilders.identifier("path"),
          typeBuilders.literal("/tables")
        ),
        typeBuilders.property(
          "init",
          typeBuilders.identifier("component"),
          typeBuilders.identifier("Layout")
        ),
        typeBuilders.property(
          "init",
          typeBuilders.identifier("redirect"),
          typeBuilders.literal(`/tables/${name}`)
        ),
        typeBuilders.property(
          "init",
          typeBuilders.identifier("name"),
          typeBuilders.literal("tables")
        ),
        typeBuilders.property(
          "init",
          typeBuilders.identifier("meta"),
          typeBuilders.objectExpression([
            typeBuilders.property(
              "init",
              typeBuilders.identifier("title"),
              typeBuilders.literal("已生成表格")
            ),
            typeBuilders.property(
              "init",
              typeBuilders.identifier("icon"),
              typeBuilders.literal("table")
            )
          ])
        ),
        typeBuilders.property(
          "init",
          typeBuilders.identifier("children"),
          typeBuilders.arrayExpression([objExp])
        )
      ]
    );
  }
  const modifiedRoutesFileCode = recast.prettyPrint(ast, { tabWidth: 2 }).code;
  console.log("modifiedRoutesFileCode", modifiedRoutesFileCode);
  fs.writeFileSync(routesFile, modifiedRoutesFileCode);
}

function generateTablePage(settings) {
  const vueTemplateFile =
    "D:/frontCode/vue-element-table-generator/templates/template.vue";
  const templateVue = String(fs.readFileSync(vueTemplateFile, "utf-8"));
  const newTemplateVue = templateVue.render(settings);
  const formatted = vueBeautify(newTemplateVue, {
    "wrap-line-length": 80,
    "wrap-attributes": "preserve",
    "indent-size": 2
  });
  fs.writeFileSync(
    `D:/frontCode/vue-element-no-npm-demo/src/pages/tables/${settings.name}.vue`,
    formatted
  );
}

function generateModules(settings) {
  const handelFile = "D:/frontCode/vue-element-table-generator/templates/modules/handle.js";
  const 
}

var generate = {
  index: function(req, res, next) {
    const settings = req.body;
    generateRoutes(settings.name, settings.label);
    generateTablePage(settings);
    json(res, "operate");
  }
};
module.exports = generate;
