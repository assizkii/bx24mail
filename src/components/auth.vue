<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Данные для подключения</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form  ref="form"
                         v-model="valid"
                         lazy-validation>
                  <v-text-field  :rules="required" prepend-icon="home" v-model="baseUrl" label="Адрес портала" type="text"></v-text-field>
                  <v-text-field  :rules="required" id="password" prepend-icon="info" v-model="hook" label="Входящий веб-хук" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="onSubmit" color="primary">Сохранить</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      valid: true,
      baseUrl: '',
      hook: '',
      required: [
        v => !!v || 'Обязательно для заполнения'
      ],
    }),
    props: {
      source: String
    },
    methods: {
      onSubmit (evt) {
        evt.preventDefault();
        if (this.$refs.form.validate()) {
          this.snackbar = true;
          localStorage.hook = this.hook;
          localStorage.baseUrl = this.baseUrl;
          this.$emit('login')
        }

      },
    }
  }
</script>
