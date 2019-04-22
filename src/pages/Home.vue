<template>
  <div class="wrapper-content wrapper-content--fixed">
    <section>
      <div class="container">

        <!-- errors -->
        <div class="error" v-if="error">
          <p> {{ error }} </p>
        </div>

        <!-- search -->
        <search
        :value="search"
        placeholder="Type Username..."
        @search="search = $event"/>

        <!-- buttons -->
        <button v-if="!repos" class="btn btnPrimary" @click="getRepos">Search</button>
        <button v-else class="btn btnPrimary" @click="getRepos">Search again</button>

        <!-- user -->
        <div class="user__wrapper" v-if="user">
          <div class="user-avatar">
            <img :src="user.avatar_url" alt="">
          </div>
          <div>
            <div class="user-login">
              {{ user.login }}
            </div>
            <span>Public repositories amount: {{ user.public_repos}}</span>
          </div>
        </div>
        <!-- wrapper -->
        <div class="repos__wrapper" v-if="repos">
          <table>
            <thead>
              <tr>
                <th @click="sort('name')" style="cursor: pointer;">Name &#8609;</th>
                <th @click="sort('stargazers_count')" style="cursor: pointer;">Stars &#8609;</th>
              </tr>
            </thead>
          <!--  item -->
            <tbody>
              <tr class="repo-item" v-for="repo in reposSort" :key="repo.id">
                <td>
                  <a class="link" target="_blanc" :href="repo.html_url">{{repo.name}}</a>
                </td>
                <td>
                  <span>
                    {{ repo.stargazers_count }} ⭐
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
           <section v-if="repos">
              <div class="container">
                <div class="button-list">
                  <div class="btn btnPrimary" @click="prevPage">
                    &#8604;
                  </div>
                  <div class="btn btnPrimary" @click="nextPage">
                    &#8605;
                  </div>
                </div>
              </div>
            </section>
            <p style="text-align: center">
              <span>debug: sort: {{ currentSort }}, dir: {{ currentSortDir }}</span>
              <p style="text-align: center"> {{ this.page.current }}, {{ this.page.length }}  </p>
            </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import search from '@/components/Search.vue'
import axios from 'axios'

export default{
  components: {
    search
  },
  data() {
    return {
      search: '',
      error: null,
      repos: null,
      user: null,
      currentSort: 'name',
      currentSortDir: 'asc',
      page: {
        current: 1,
        length: 3
      }
    }
  },
  computed: {
    reposSort() {
      return this.repos.sort((a, b) => {
        let mod = 1
        if (this.currentSortDir === 'desc') {
          mod = -1
        }
        if ( a[this.currentSort] < b[this.currentSort]) return -1 * mod
        if ( a[this.currentSort] > b[this.currentSort]) return 1 * mod
        return 0
      }).filter((row, index) => {
        let start = (this.page.current-1)*this.page.length
        let end = this.page.current*this.page.length
        if (index >= start && index < end) return true

      })
    }
  },
  methods: {
    getRepos() {
      axios.all([
        axios
          .get(`https://api.github.com/users/${this.search}/repos`)
            .then(res => {
              console.log(res)
              this.error = null
              this.repos = res.data
            })
            .catch(err => {
              console.log(err);
              this.repos = null
              this.error = 'Can`t find this user'
            }),
        axios
          .get(`https://api.github.com/users/${this.search}`)
            .then(response => {
              console.log(response)
              this.error = null
              this.user = response.data
            })
            .catch(err => {
              console.log(err);
              this.user = null
              this.error = 'Can`t find this user'
            })
        ])
    },
    sort(e) {
      if (e === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = e
    },

    //Pagination
    prevPage() {
      if (this.page.current > 1) this.page.current-=1
    },
    nextPage() {
      if (this.page.current * this.page.length < this.repos.length) this.page.current+=1
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.btn {
   margin-top: 40px;
}
.repos__wrapper {
  width: 400px;
  margin: 30px 0;
}
table{
  width: 450px;
}
.repo-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px 0;
  align-items: center;
  border-bottom: 1px solid #dbdbdb;
}
.error {
  margin-bottom: 20px;
}
.user__wrapper{
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.user-avatar{
  img{
    border-radius: 50%;
    width: 100px;
  }
}
.user-login{
  margin-bottom: 5px;
}

.button-list{
  text-align: center;
  width: 100%;
  .btn{
  border-radius: 60px;
  margin: 0 20px;
  }
}
</style>
