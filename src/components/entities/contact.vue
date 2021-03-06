<template>
    <v-app id="contact">
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
                Контакт успешно {{status}}.     <v-btn target="_blank" :href="contactLink" color="success">Открыть</v-btn>
            </v-alert>

            <v-select
                    v-if="!newContact && contacts.length > 0"
                    v-model="formData.contact"
                    :items="contacts"
                    item-text="FULL_NAME"
                    item-value="ID"
                    label="Выберите контакт"
                    single-line
                    @change="getContact"
            ></v-select>

            <v-switch
                    v-if="contacts.length > 0"
                    v-model="newContact"
                    :label="`Создать новый контакт`"
            ></v-switch>

            <v-text-field
                    v-model="formData.name"
                    :rules="nameRules"
                    label="Имя"
                    required
            ></v-text-field>

            <v-text-field
                    v-model="formData.lastname"
                    :rules="lastnameRules"
                    label="Фамилия"
                    required
            ></v-text-field>

            <v-text-field
                    v-model="formData.phone"
                    :mask="phoneMask"
                    label="Телефон"
                    required
            ></v-text-field>

            <v-autocomplete
                    v-model="formData.company"
                    :items="companies"
                    chips
                    color="blue-grey lighten-2"
                    label="Компания"
                    item-text="TITLE"
                    item-value="ID"
                    @keyup="searchCompanies"
            >
                <template
                        slot="selection"
                        slot-scope="data"
                >
                    <v-chip
                            :selected="data.selected"
                            close
                            class="chip--select-multi"
                            @input="formData.company = null"
                    >
                        {{ data.item.TITLE }}
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
                        <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.TITLE"></v-list-tile-title>
                        </v-list-tile-content>
                    </template>
                </template>
            </v-autocomplete>


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
        name: 'Contact',

        computed: {
            ...mapGetters([
                'managers',
                'baseUrl',
                'loading',
                'email',
                'companies',
                'contacts'
            ])
        },

        data () {
            return {
                status: 'обновлена',
                saveSuccess: false,
                contactLink: null,
                newContact: false,
                formData: {
                    name: '',
                    lastname: '',
                    phone: '',
                    phoneId: null,
                    company: null,
                    contact: null,
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

            searchCompanies: debounce(function (e) {
                let query = e.target.value;
                if (query.length > 4) {
                    let payload = {'query': query};
                    this.$store.dispatch("loadCompanies", payload)
                }
            }, 500),


            searchManager: debounce(function (e) {
                let query = e.target.value;
                if (query.length > 4) {
                    let payload = {'query': query};
                    this.$store.dispatch("loadManagers", payload)
                }
            }, 500),

            getContact: async function (id) {

                this.formData.contact = id;

                let params = {
                    id: this.formData.contact
                };

                await this.axios.get(this.baseUrl+'/crm.contact.get.json', {params}).then(response => {
                    let data = response.data.result;
                    this.formData.name = data.NAME;
                    this.formData.lastname = data.LAST_NAME;
                    this.formData.phone = data.PHONE[0]['VALUE'];
                    this.formData.phoneId = data.PHONE[0]['ID'];
                    let payload = {'id': data.COMPANY_ID};


                    this.$store.dispatch("loadCompanies", payload);
                    this.formData.company = data.COMPANY_ID;

                    this.$store.dispatch('loadUser', {'id': data.ASSIGNED_BY_ID}).then(response => {
                        this.formData.responsible = data.ASSIGNED_BY_ID;
                    });

                })
            },

            sendForm: async function () {

                let method = 'crm.contact.add.json';

                let params = {
                    fields: {
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
                                'ID': this.formData.phoneId,
                                'VALUE_TYPE' : 'WORK',
                                'VALUE' : this.formData.phone
                            }
                        ],
                        'COMPANY_IDS' : [this.formData.company],
                        'ASSIGNED_BY_ID' : this.formData.responsible
                    }
                };

                if (this.newContact === false) {
                    method = 'crm.contact.update.json';
                    params['ID'] = this.formData.contact;
                }

                await this.axios.post(this.baseUrl+'/'+method, params).then(response => {

                    let contactId = response.data.result;

                    if (this.newContact !== false) {

                        this.status = 'создана';

                        this.$store.dispatch('init').then(response => {
                            this.getContact(contactId)
                        });

                        this.contactLink = localStorage.baseUrl+'/crm/company/show/'+contactId+'/';
                        this.saveSuccess = true;

                    } else {

                        this.contactLink = localStorage.baseUrl+'/crm/company/show/'+this.formData.contact+'/';
                        this.saveSuccess = true;

                    }

                })
            }

        }
    }
</script>