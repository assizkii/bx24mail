<template>
    <v-app id="lead" >
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >

            <v-select
                    v-if="!newLead && leads.length > 0"
                    v-model="formData.lead"
                    :items="leads"
                    item-text="FULL_NAME"
                    item-value="ID"
                    label="Выберите лида"
                    single-line
                    @change="getLead"
            ></v-select>

            <v-switch
                    v-if="leads.length > 0"
                    v-model="newLead"
                    :label="`Создать новый контакт`"
            ></v-switch>

            <!--name-->
            <v-text-field
                    v-model="formData.name"
                    :rules="nameRules"
                    label="Имя"
                    required
            ></v-text-field>

            <!--lastname-->
            <v-text-field
                    v-model="formData.lastname"
                    :rules="lastnameRules"
                    label="Фамилия"
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

        name: 'Lead',

        computed: {
            ...mapGetters([
                'managers',
                'loading',
                'leads',
                'baseUrl',
                'email'
            ])
        },

        data () {
            return {
                newLead: false,
                formData: {
                    lead: null,
                    name: '',
                    lastname: '',
                    phone: '',
                    responsible: null,
                },
                phoneMask: 'phone',

                userAccess: false,
                valid: true,

                nameRules: [
                    v => !!v || 'Имя обязательно'
                ],
                lastnameRules: [
                    v => !!v || 'Фамилия обязательна'
                ],

            }
        },

        methods: {

            validate () {
                if (this.$refs.form.validate()) {
                    this.snackbar = true;
                    this.sendForm()
                }
            },

            getLead: async function (id) {

                this.formData.lead = id;

                let params = {
                    id: this.formData.lead
                };

                await this.axios.get(this.baseUrl+'/crm.lead.get.json', {params}).then(response => {
                    let data = response.data.result;
                    console.log(data);

                    this.formData.name = data.NAME;
                    this.formData.lastname = data.LAST_NAME;

                    data.PHONE.map((phone) => {
                        if (phone.VALUE_TYPE === 'WORK') {
                            this.formData.phone = phone.VALUE
                        }
                    });

                    this.formData.responsible = data.ASSIGNED_BY_ID;
                })
            },

            sendForm: async function () {

                let method = 'crm.lead.add.json';

                let params = {
                    fields: {
                        'TITLE' : this.formData.name +' ' +this.formData.lastname,
                        'NAME'  : this.formData.name,
                        'LAST_NAME' : this.formData.lastname,
                        'EMAIL':  [
                            {
                                'VALUE_TYPE' : 'WORK',
                                'VALUE' : this.email
                            }
                        ],
                        'PHONE': [
                            {
                                'VALUE_TYPE' : 'WORK',
                                'VALUE' : this.formData.phone
                            }
                        ],
                        'ASSIGNED_BY_ID' : this.formData.responsible
                    }
                };
                if (this.newLead === false) {
                    method = 'crm.lead.update.json';
                    params['ID'] = this.formData.lead;

                }
                await this.axios.post(this.baseUrl+'/'+method, params).then(response => {

                    let data = response.data.result;

                    if (this.newLead !== false) {
                        this.getLead(data.result)
                    }
                })
            },

            searchManager: debounce(function (e) {
                let query = e.target.value;
                if (query.length > 4) {
                    let payload = {'query': query};
                    this.$store.dispatch("loadManagers", payload)
                }
            }, 500),

        }

    }
</script>