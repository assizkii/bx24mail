<template>
    <v-app id="settings">



        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <v-alert
                    :value="saveSuccess"
                    type="success"
                    transition="scale-transition"
                    outline
                    class="my-3"
            >
                Настройки сохранены
            </v-alert>

            <!--name-->
            <v-text-field
                    v-model="baseUrl"
                    :rules="required"
                    label="Название"
                    required
            ></v-text-field>

            <!--name-->
            <v-text-field
                    v-model="hook"
                    :rules="required"
                    label="Веб-хук"
                    required
                    type="password"
            ></v-text-field>

            <!--name-->
            <v-text-field
                    v-model="userId"
                    :rules="required"
                    label="ID пользователя веб-хука"
                    required
            ></v-text-field>

            <v-btn
                    :disabled="!valid"
                    color="success"
                    @click="onSubmit"
            >
                Сохранить
            </v-btn>


        </v-form>
    </v-app>
</template>

<script>

    export default {

        name: 'Settings',

        data: () => ({
            saveSuccess: false,
            valid: true,
            userId:  localStorage.userId,
            baseUrl: localStorage.baseUrl,
            hook: localStorage.hook,
            required: [
                v => !!v || 'Обязательно для заполнения'
            ],
        }),

        methods: {
            onSubmit (evt) {
                evt.preventDefault();
                if (this.$refs.form.validate()) {
                    this.snackbar = true;
                    localStorage.hook = this.hook;
                    localStorage.baseUrl = this.baseUrl;
                    localStorage.userId = this.userId;
                    let baseUrl = localStorage.baseUrl+'/rest/'+localStorage.userId+'/'+localStorage.hook;
                    this.$store.dispatch('setBaseUrl', baseUrl);

                    this.$emit('login');
                    this.saveSuccess = true;
                }

            },
        }
    }
</script>