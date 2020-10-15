<template>
  <div class="hello">
  <!-- 钱包选择器 -->
    <a-select
      placeholder="选择钱包查询"
      style="width: 400px"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      @change="handleAddressChange">
      <a-select-option v-for="item in walletAddress" :key="item.address">
        {{item.name}}
      </a-select-option>
    </a-select>

  <!-- 筛选 -->
    <div style="margin: 10px">

    <span>选择类型： </span>
    <a-select
      v-model="search.filtertype"
      placeholder="选择类型"
      style="width: 200px"
      :filter-option="false"
      :not-found-content="null">
      <a-select-option v-for="item in filters.typefilter" :key="item.value">
        {{item.text}}
      </a-select-option>
    </a-select>

    <span style="margin-left: 100px">额度条件： </span>
    <a-select
      v-model="search.filteroperator"
      placeholder="条件"
      style="width: 100px"
      :filter-option="false"
      :not-found-content="null">
      <a-select-option v-for="item in filters.operatorfilters" :key="item.value">
        {{item.text}}
      </a-select-option>
    </a-select>  

    <a-input-number style="width: 100px" v-model="search.filtervalue" placeholder="200"/>

    <a-select
      v-model="search.filterunit"
      placeholder="单位"
      style="width: 100px"
      :filter-option="false"
      :not-found-content="null">
      <a-select-option v-for="item in filters.unitfilters" :key="item.value">
        {{item.text}}
      </a-select-option>
    </a-select>       

    <a-button type="primary" @click="submitFilter">
        查询
    </a-button>
    </div>
  <!-- 表格 -->
    <a-table :columns="columns" :data-source="tableData"
        :pagination="pagination"
        @change="handleTableChange"
      >
      <!-- <span slot="timestamp" slot-scope="timestamp">{{ formatterTime(timestamp) }}</span> -->
      <div slot="cid" slot-scope="cid">
        <div class="cid" type="link" block @click="gotomessage(cid)">
        {{fix(cid)}}
        </div>
      </div>
      <div slot="from" slot-scope="from">
        {{fix(from)}}
      </div>
      <!-- <span slot="value" slot-scope="value">{{ formatFilValue(value) }}</span> -->

    </a-table>

  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

const columns = [
  {
    title: '区块高度',
    dataIndex: 'block_height',
    key: 'block_height',
    width: '8%',
  },
  {
    title: '时间',
    dataIndex: 'timestamp_str',
    key: 'timestamp_str',
    width: '12%',

  },
  {
    title: '消息id',
    dataIndex: 'cid',
    key: 'cid',
    ellipsis: true,
    scopedSlots: { customRender: 'cid'},
  },
  {
    title: 'from',
    dataIndex: 'from',
    key: 'from',
    ellipsis: true,
    scopedSlots: { customRender: 'from'},
  },
  {
    title: 'to',
    dataIndex: 'to',
    key: 'to',
    ellipsis: true,
  },
  {
    title: '值',
    key: 'income_str',
    dataIndex: 'income_str',
    scopedSlots: { customRender: 'value'},
    width: '20%',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
];

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    this.getWallet()
  },

  methods: {
    handleAddressChange(value) {
       this.value = value
       this.getTransfers(1, 20)
    },

    getWallet: function() {
      axios.get(this.apiPrefix + '/wallet').then((response) => {
        this.walletAddress = response.data
      })
    },
    getTransfers: function(page, pagesize) {
      var conditions = this.buildCondition()
      var u = this.apiPrefix + '/wallet/' + this.value + "?page=" + page + "&pageSize=" + pagesize
      if (conditions.length > 0) {
        u += conditions
      }
      axios.get(u).then((response) => {
        this.tableData = response.data.data
        this.pagination.total = response.data.total
      })
    },

    handleTableChange: function(pagination, filters, sorter, { currentDataSource }) {
      this.getTransfers(pagination.current, pagination.pageSize)
      console.log(filters)
      console.log(sorter)
      console.log(currentDataSource)
    },

    formatterTime: function(val) {
      return val ? moment(val*1000).format('YYYY-MM-DD HH:mm:ss') : ''
    },

    formatFilValue: function(val) {
      var fvalue = +(val)
      
      if (Math.abs(fvalue) > Math.pow(10, 15) ) {
        return (fvalue/Math.pow(10,18)).toFixed(5) + " FIL"
      }
      if (Math.abs(fvalue) > Math.pow(10, 6) ) {
        return (fvalue/Math.pow(10,9)).toFixed(5) + " nonaFIL"
      }
      return fvalue.toFixed(5) + " attoFIL"
    },

    buildCondition: function() {
      var qstr = ""
      if (this.search.filtertype.length > 0) {
        qstr += "&type="+this.search.filtertype
      }
      if (this.search.filteroperator.length >0) {
        qstr += "&op=" + this.search.filteroperator + "&value=" + this.search.filtervalue*this.search.filterunit
      }
      return qstr
    },
    submitFilter: function() {
      this.getTransfers(1, 20)
    },
    gotomessage: function(cid) {
       var href="https://filscout.io/zh/pc/message/" + cid
       window.open(href,'_blank')
    },
    fix: function(str) {
      if  (str.length > 10) {
        return str.substring(0, 6)+'****'+str.substring(str.length-6,str.length)
      }
      return str
    }
  },
  data: function() {
    return {
      walletAddress:  [],
      value: "",
      apiPrefix: "/v1",
      // apiPrefix: "http://127.0.0.1:8080/v1",
      columns: columns,
      tableData: [],
      pagination: {
        total: 20,
        pageSize: 20,
        defaultCurrent: 1,
      },
      search: {
        filtervalue: 0,
        filtertype: "",
        filterunit: 1,
        filteroperator: "",
      },
      filters: {
        typefilter: [
          {
            text: 'NONE',
            value: '',
          },
          {
            text: 'receive',
            value: 'receive',
          }, {
            text: 'send',
            value: 'send',
          }, {
            text: 'burn-fee',
            value: 'burn-fee',
          }, {
            text: 'miner-fee',
            value: 'miner-fee',
          }, {
            text: 'reward',
            value: 'reward',
          }, {
            text: 'burn',
            value: 'burn',
          }, 
        ],
        unitfilters: [
          {text: 'FIL', value: Math.pow(10,18)},
          {text: 'nanoFIL', value: Math.pow(10,9)},
          {text: 'attoFIL', value: 1},
        ],
        operatorfilters: [
          {text: 'NONE', value: ''},
          {text: '=', value: '$eq'},
          {text: '>', value: '$gt'},
          {text: '<', value: '$lt'},
        ],

      },

    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.cid {

  text-overflow:ellipsis;
  cursor:pointer;
}
.cid:hover{
  color:blue;
}

</style>
