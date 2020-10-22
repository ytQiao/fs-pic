<template>
  <div id="app">
    <div class="left-banner">
      <div style="margin-top: 0px;"> 
        <span>免费分享精彩的素材图片</span>
      </div>
          <a-input-search placeholder="输入hash检索素材"
          style="width: 50%;"
          size="large"
          class="mg20 topfix"
          enter-button @search="onSearch"/> 
    </div>
    <div class="video-body">
      <ViewPicture :search="search"/>
    </div>
   
  </div>
</template>

<script>
import ViewPicture from './components/viewPicture.vue'

export default {
  name: 'App',
  components: {
    ViewPicture
  },
  data: function() {
    return {
      search: ""
    }
  },
  methods: {
    onSearch: function(value) {
      this.search = value
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

.video-body {
    width:100%;
    height:100%;
    clear:both
}

.left-banner {
    height:200px;
    font-size: 50px;
    font-style: italic;
    font-weight: 600;
    text-shadow: 1px 2px 3px gray, 0px 0px 2px black;
    color: #white;
    background-image: url(./assets/static/img/banner5.png);
    background-size:100% 100%;

}


.right-banner {
    float:left;
    width:75%;
    height:100px;
    border:1px solid #999;
}



</style>
