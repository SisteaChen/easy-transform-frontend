<template>
  <div class="content">
    {{sentence.content}}
  </div>
</template>

<script>
  import {getSentence} from "@/api/sentence_one_day";

  export default {
    name: "Sentence",
    data(){
      return {
        sentence: {
          content: '理论都是灰色的，而生命之树长青',
        }
      }
    },
    created() {
      this.fetchSentence()
    },
    methods:{
      async fetchSentence(){
        getSentence().then((value)=>{
          this.sentence.content = value.sentence
        })
      }
    }
  }
</script>

<style scoped>
.content{
  font-family: 宋体;
  font-size: 15px;
  color: darkslateblue;
}
</style>