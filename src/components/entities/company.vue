<template>
    <v-app id="company">
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
                Компания успешно {{status}}.     <v-btn target="_blank" :href="companyLink" color="success">Открыть</v-btn>
            </v-alert>

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


            <!--managers-->
            <v-autocomplete
                    v-model="formData.responsible"
                    :items="managers"
                    chips
                    color="blue-grey lighten-2"
                    label="Менеджер"
                    item-text="FULL_NAME"
                    item-value="ID"
                    @keyup="searchManager"
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
                'email',
                'managers',
                'loading',
                'companies',
                'baseUrl'
            ])
        },

        data () {
            return {
                status: 'обновлена',
                saveSuccess: false,
                companyLink: null,
                newCompany: true,
                formData: {
                    phoneId: null,
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
                    this.snackbar = true;
                    this.sendForm();
                }

            },

            searchManager: debounce(function (e) {
                let query = e.target.value;
                if (query.length > 4) {
                    let payload = {'query': query};
                    this.$store.dispatch("loadManagers", payload)
                }
            }, 500),

            getCompany: async function (id) {

                this.formData.company = id;

                let params = {
                    id: this.formData.company
                };

                await this.axios.get(this.baseUrl+'/crm.company.get.json', {params}).then(response => {

                    let data = response.data.result;
                    this.formData.title = data.TITLE;
                    this.formData.phone = data.PHONE[0]['VALUE'];
                    this.formData.phoneId = data.PHONE[0]['ID'];

                    this.$store.dispatch('loadUser', {'id': data.ASSIGNED_BY_ID}).then(response => {
                        this.formData.responsible = data.ASSIGNED_BY_ID;
                    });

                })
            },

            sendForm: async function () {

                let method = 'crm.company.add.json';

                let params = {
                        fields: {
                            'TITLE'  : this.formData.title,
                            'EMAIL':  [
                                {
                                    'VALUE_TYPE' : 'WORK',
                                    'VALUE' : this.email
                                }
                            ],
                            'PHONE': [
                                {
                                    'ID': this.formData.phoneId,
                                    'VALUE_TYPE' : 'WORK',
                                    'VALUE' : this.formData.phone
                                }
                            ],
                            'ASSIGNED_BY_ID' : this.formData.responsible
                        }
                };

                if (this.newCompany === false) {

                    method = 'crm.company.update.json';
                    params['ID'] = this.formData.company;

                }

                await this.axios.post(this.baseUrl+'/'+method, params).then(response => {

                    let companyId = response.data.result;

                    if (this.newCompany !== false) {

                        this.status = 'создана';

                        this.$store.dispatch('init').then(response => {
                            this.getCompany(companyId)
                        });

                        this.companyLink = localStorage.baseUrl+'/crm/company/show/'+companyId+'/';
                        this.saveSuccess = true;

                    } else {

                        this.companyLink = localStorage.baseUrl+'/crm/company/show/'+this.formData.company+'/';
                        this.saveSuccess = true;

                    }

                })
            }
        },

    }
</script>