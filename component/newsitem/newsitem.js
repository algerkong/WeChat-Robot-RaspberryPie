// component/chatItem/chatItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image: {
      type: String,
      value: '../../image/img.jpg'
    },
    newslist: {
      type: Array,
      value: []
    }
  },

  created() {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getItemWidth(e) {
      console.log(e);
    }
  }
})
