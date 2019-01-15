<template>
    <v-app id="settings">
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >

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
                    @click="validate"
            >
                Сохранить
            </v-btn>

            <v-btn
                    color="error"
                    @click="reset"
            >
                Очистить
            </v-btn>

        </v-form>
    </v-app>
</template>

<script>

    export default {
        name: 'Settings',
        data: () => ({
            valid: true,
            userId:  localStorage.userId,
            baseUrl: localStorage.baseUrl,
            hook: localStorage.hook,
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
                    localStorage.userId = this.userId;
                    this.$emit('login')
                }

            },
        }
    }
</script>