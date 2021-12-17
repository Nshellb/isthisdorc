<template>
  <div class="home">
    <div class="title">
      <h1>Is this Dog or Cat?</h1>
    </div>

    <!-- image upload -->
    <div class="file-upload">
      <form @submit.prevent="formSubmit" method="post">
        <input type="file" ref="selectFile" @change="previewFile" />
        <button type="submit" :disabled="isUploading">Upload</button>

        <div>
          <hr />
          debug
          <br>
          response : {{ response }}
        </div>
      </form>
    </div>

    <!-- 이미지 미리보기 박스 -->
    <div class="img_box">
      <img class="uploaded_img" v-if="previewImgUrl" :src="previewImgUrl" />
    </div>

    <!-- 이미지 업로드 버튼 -->
    <label class="input_file_label" for="input_img">upload img</label>
    <input type="file" id="input_img" ref="selectFile" @change="previewFile" style="display: none"/>

    <!-- 이미지 검사 버튼 -->
    <label class="input_submit_label" for="input_sub">what is it?</label>
    <input id="input_sub" style="display: none"/>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Home',
  data() {
    return {
      previewImage: null,

      // image upload
      selectFile: null, // 파일 객체
      previewImgUrl: null, // 미리보기 이미지 URL
      isUploading: false, // 파일 업로드 체크
      response: null, // 파일 업로드후 응답값
    };
  },
  methods: {
    selectImage() {
      this.$refs.fileInput.click()
    },
    pickFile() {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },

    // image upload
    previewFile() {
      // 선택된 파일이 있는가?
      if (0 < this.$refs.selectFile.files.length) {
        // 0 번째 파일을 가져 온다.
        this.selectFile = this.$refs.selectFile.files[0]
        // 마지막 . 위치를 찾고 + 1 하여 확장자 명을 가져온다.
        let fileExt = this.selectFile.name.substring(
          this.selectFile.name.lastIndexOf(".") + 1
        )
        // 소문자로 변환
        fileExt = fileExt.toLowerCase()
        // 이미지 확장자 체크, 1메가 바이트 이하 인지 체크
        if (
          ["jpeg", "png", "gif", "bmp"].includes(fileExt) &&
          this.selectFile.size <= 1048576
        ) {
          // FileReader 를 활용하여 파일을 읽는다
          var reader = new FileReader()
          reader.onload = e => {
            // base64
            console.log("1111")
            console.log(e.target.result)
            console.log("2222")
            
            this.previewImgUrl = e.target.result
          }
          reader.readAsDataURL(this.selectFile)
        } else if (this.selectFile.size <= 1048576) {
          // 이미지외 파일
          this.previewImgUrl = null
        } else {
          alert("파일을 다시 선택해 주세요.")
          this.selectFile = null
          this.previewImgUrl = null
        }
      } else {
        // 파일을 선택하지 않았을때
        this.selectFile = null
        this.previewImgUrl = null
      }
      console.log(this.selectFile)
    },

    async formSubmit() {
      if (this.selectFile) {
        // Form 필드 생성
        let form = new FormData()
        form.append("file", this.selectFile) // api file name
        this.isUploading = true

        http
          .post("/api/sample/upload/", form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(res => {
            this.response = res
            this.isUploading = false
          })
          .catch(error => {
            this.response = error
            this.isUploading = false
          })
      } else {
        alert("파일을 선택해 주세요.")
      }

      return true
    },
  },
}
</script>

<style>
.img_box {
  width: 250px;
  height: 250px;
  display: block;
  margin: 0 auto 30px;
  border: 1px solid gray;
  align-self: center;
  background-size: cover;
  background-position: center center;
}

.uploaded_img {
  width:100%;
  height:100%;
  object-fit: contain;
}

.input_file_label {
  font-size: 13px;
  color: #000000;

  border-style: solid;
  border-width: 0.1px;
  border-radius: 2px;

  padding-top: 2.2px;
  padding-right: 8px;
  padding-bottom: 2px;
  padding-left: 8px;

  border-color: rgb(118, 118, 118);
  background-color: rgb(239, 239, 239);
  text-shadow: none;
}

.input_file_label:hover {
  border-color: rgb(79, 79, 79);
  background-color: rgb(229, 229, 229);
}

.input_submit_label {
  font-size: 13px;
  color: #000000;

  border-style: solid;
  border-width: 0.1px;
  border-radius: 2px;

  padding-top: 2.2px;
  padding-right: 8px;
  padding-bottom: 2px;
  padding-left: 8px;

  border-color: rgb(118, 118, 118);
  background-color: rgb(239, 239, 239);
  text-shadow: none;
}

.input_submit_label:hover {
  border-color: rgb(79, 79, 79);
  background-color: rgb(229, 229, 229);
}


</style>