<template>
    <v-app id="company">
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >

            <v-select
                    v-if="!newCompany && companies.length > 0"
                    v-model="formData.company"
                    :items="companies"
                    item-text="TITLE"
                    item-value="ID"
                    label="Выберите компанию"
                    single-line
                    @change="getCompany"
            ></v-select>

            <v-switch
                    v-if="companies.length > 0"
                    v-model="newCompany"
                    :label="`Создать новую компанию`"
            ></v-switch>

            <!--name-->
            <v-text-field
                    v-model="formData.title"
                    :rules="titleRules"
                    label="Название"
                    required
            ></v-text-field>

            <!--phone-->
            <v-text-field
                    v-model="formData.phone"
                    :mask="phoneMask"
                    label="Телефон"
                    required
            ></v-text-field>

            <v-autocomplete
                    v-model="formData.responsible"
                    :items="managers"
                    chips
                    color="blue-grey lighten-2"
                    label="Менеджер"
                    item-text="FULL_NAME"
                    item-value="ID"
            >
                <template
                        slot="selection"
                        slot-scope="data"
                >
                    <v-chip
                            :selected="data.selected"
                            close
                            class="chip--select-multi"
                            @input="formData.responsible = null"
                    >
                        <v-avatar>
                            <img :src="data.item.PERSONAL_PHOTO">
                        </v-avatar>
                        {{ data.item.FULL_NAME }}
                    </v-chip>
                </template>
                <template
                        slot="item"
                        slot-scope="data"
                >
                    <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                        <v-list-tile-avatar>
                            <img :src="data.item.PERSONAL_PHOTO">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.FULL_NAME"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="data.item.PERSONAL_PROFESSION"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </template>
                </template>
            </v-autocomplete>

            <v-btn
                    :disabled="!valid"
                    color="success"
                    @click="validate"
            >
                Отправить в CRM
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
    import { mapGetters } from 'vuex'
    import debounce from 'debounce'

    export default {
        name: 'Company',

        computed: {
            ...mapGetters([
                'managers',
                'loading',
                'companies',
                'baseUrl'
            ])
        },

        data () {
            return {
                newCompany: false,
                formData: {
                    title: '',
                    phone: '',
                    company: null,
                    responsible: null
                },
                phoneMask: 'phone',

                userAccess: false,
                valid: true,

                titleRules: [
                    v => !!v || 'Название обязательно'
                ],

            }
        },

        methods: {

            validate () {
                if (this.$refs.form.validate()) {
                    this.snackbar = true
                }
            },

            reset () {
                this.$store.dispatch("clearData");
                this.$refs.form.reset()
            },

            getCompany: async function () {

                let params = {
                    id: this.formData.company
                };

                await this.axios.get(this.baseUrl+'/crm.company.get.json', {params}).then(response => {
                    let data = response.data.result;
                    this.formData.title = data.TITLE;
                    this.formData.phone = data.PHONE;
                    // let payload = {'id': data.COMPANY_ID};
                    // this.$store.dispatch("loadCompanies", payload);

                    this.formData.responsible = data.ASSIGNED_BY_ID;
                })
            }

        },

        created: function() {
            this.$store.dispatch("loadManagers");
        }
    }
</script>