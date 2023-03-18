<template>
  <div class="uploadBox">
    <!-- 返回主页 -->
    <div class="homeBox">
      <router-link to="/">
        <el-tooltip content="返回列表页面" placement="top">
          <i class="el-icon-tickets"></i>
        </el-tooltip>
      </router-link>
    </div>

    <!-- 上传文件按钮 -->
    <div class="buttonBox">
      <el-upload
        action
        accept=".xlsx, .xls"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handle"
      >
        <el-button type="primary" slot="trigger">选取EXCEL文件ddd</el-button>
      </el-upload>

      <el-button type="success" @click="submit" :disabled="disable"
        >采集数据提交</el-button
      >
    </div>

    <!-- 解析出来的数据 -->
    <div class="tableBox" v-show="show">
      <h3>
        <i class="el-icon-info"></i>
        小主，以下是采集完成的数据，请您检查无误后，点击“采集数据提交”按钮上传至服务器哦！
      </h3>

      <el-table :data="tempData" style="width: 100%" :height="height" border>
        <el-table-column
          prop="name"
          label="姓名"
          min-width="50%"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          min-width="50%"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import xlsx from "xlsx";
import { Loading } from "element-ui";
import { readFile, character, delay } from "./assets/lib/utils";
import { createAPI } from "./api/index";

export default {
  data() {
    return {
      height: document.documentElement.clientHeight - 130,
      tempData: [],
      show: false,
      disable: false,
    };
  },
  methods: {
    // 采集EXCEL数据
    async handle(ev) {
      let file = ev.raw;
      if (!file) return;

      this.show = false;
      let loadingInstance = Loading.service({
        text: "小主，请您稍等片刻，奴家正在玩命处理中！",
        background: "rgba(0,0,0,.5)",
      });

      await delay(100);
      //读取FILE中的数据（变为JSON格式）
      let data = await readFile(file);
      let workbook = xlsx.read(data, { type: "binary" }),
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      data = xlsx.utils.sheet_to_json(worksheet);
console.log("data", data);
      //把读取出来的数据变为最后可以传递给服务器的数据（姓名：name  电话：phone）
      let arr = [];
      data.forEach((item) => {
        let obj = {};
        for (let key in character) {
          if (!character.hasOwnProperty(key)) break;
          let v = character[key],
            text = v.text,
            type = v.type;
          v = item[text] || "";
          type === "string" ? (v = String(v)) : null;
          type === "number" ? (v = Number(v)) : null;
          obj[key] = v;
        }
        arr.push(obj);
      });

      await delay(100);
      // 展示到页面中
      this.show = true;
      this.tempData = arr;
      console.log('arr', arr)
      loadingInstance.close();
    },
    // 提交数据给服务器
    async submit() {
      if (this.tempData.length <= 0) {
        this.$message({
          message: "小主，请您先选择EXCEL文件！",
          type: "warning",
          showClose: true,
        });
        return;
      }

      this.disable = true;
      let loadingInstance = Loading.service({
        text: "小主，请您稍等片刻，奴家正在玩命处理中！",
        background: "rgba(0,0,0,.5)",
      });

      // 完成后处理的事情
      let complate = () => {
        this.$message({
          message: "小主，奴家已经帮您把数据上传了！",
          type: "success",
          showClose: true,
        });
        this.show = false;
        this.disable = false;
        loadingInstance.close();
      };

      // 需要把数据一条条传递给服务器
      let n = 0;
      let send = async () => {
        if (n > this.tempData.length - 1) {
          // 都传递完了
          complate();
          return;
        }
        let body = this.tempData[n];
        let result = await createAPI(body);
        if (parseInt(result.code) === 0) {
          // 成功
          n++;
        }
        send();
      };
      send();
    },
  },
};
</script>

<style lang="less" scoped>
.homeBox {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  font-size: 35px;
}

.uploadBox {
  padding: 20px;
}

.buttonBox {
  display: flex;

  .el-button {
    margin-left: 20px;
  }
}

.tableBox {
  h3 {
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
    color: lightcoral;
  }
}
</style>