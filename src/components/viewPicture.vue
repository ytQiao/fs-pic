<template>
  <div>
  <div v-if="search.length === 0" class="photo-body" style="margin-top: 40px">
    <div class="photos__column" v-for="(showlist, ind) in showGroup" :key="ind">
      <a-card hoverable v-for="(item, index) in showlist" :key="index" >
        <img
          slot="cover"
          alt="example"
          :src="item.url"
        />
        <a-card-meta>
          <template slot="title">
            {{item.fileName}}
            <a :href="item.url" target="_blank"> <a-icon type="download" /> </a>
          </template>
          <template slot="description">
            {{item.cid}}
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
  <div v-else style="margin-top: 40px">
     <img v-if="searchRes !== null"
          alt="example"
          width="800"
          :src="searchRes.url"
        />
      <span v-else>
        {{"请输入正确的hash"}}
      </span>
  </div> 

    
   
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'ViewPicture',
  props: {
    search: String
  },
  mounted() {
    this.getData(1, 40)
  },

  methods: {
    getData: function(page, pagesize) {
      let p = page ? page : 1
      let ps = pagesize ? pagesize : 20
      var u = '/api/v1/ipfs/picture' + "?page=" + p + "&pageSize=" + ps
      axios.get(u).then((response) => {
        this.tableData = response.data.data.results.map(x => {
          x['url'] = "http://61.155.145.10:8080/ipfs/" + x['cid']
          return x
        })
        this.pagination.total = response.data.data.count
      })
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
        return (fvalue/Math.pow(10,9)).toFixed(5) + " nanoFIL"
      }
      return fvalue.toFixed(5) + " attoFIL"
    },

    fix: function(str) {
      if  (str.length > 10) {
        return str.substring(0, 10)+'****'+str.substring(str.length-10,str.length)
      }
      return str
    },
    tosize: function(bytes) {
      if (bytes === 0) return '0 B';
      var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    buildShowGroup: function(val) {
      var div = 3
      var ind = 0
      var i = 0
      if (val.length > 0) {
        this.showGroup = [[],[],[]]
        for (i=0; i<val.length; i++) {
          ind = i % div
          this.showGroup[ind].push(val[i])
        }
      }
    },
    doSearch: function(val) {
      var u = '/api/v1/ipfs/picture?cid=' + val
      this.searchRes = null
      axios.get(u).then((response) => {
        if (response.data.data.results.length > 0) {
          this.searchRes = response.data.data.results[0]
          this.searchRes['url'] = "http://61.155.145.10:8080/ipfs/" + this.searchRes['cid']
        }
      })
    }

  },
  data: function() {
    return {
      walletAddress:  [],
      value: "",
      tableData: [],
      searchRes: null,
      showGroup: [],
      pagination: {
        total: 20,
        pageSize: 10,
        defaultCurrent: 1,
      },
    }
  },
  watch: {
    search: function(val) {
      this.doSearch(val)
    },
    tableData: function(val) {
      this.buildShowGroup(val)
    }

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #42b983;
}

.mg20 {
  margin: 5px;
}

.photos__column {
    float:left;
    width: 30%;
    margin: 1%
}

.photo-body {
  margin-top: "10px"

}


</style>
