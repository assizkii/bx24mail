<template>
    <v-app id="deal">



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
                Сделка успешно создана.     <v-btn target="_blank" :href="dealLink" color="success">Открыть</v-btn>
            </v-alert>

            <div>

            </div>
            <!--name-->
            <v-text-field
                    v-model="formData.title"
                    :rules="titleRules"
                    label="Название"
                    required
            ></v-text-field>

            <v-select
                    v-model="formData.group"
                    v-if="dealGoodsGroup.length > 0"
                    :items="dealGoodsGroup"
                    label="Товарная группа"
            ></v-select>

            <v-select
                    v-model="formData.direction"
                    v-if="dealDirections.length > 0"
                    :items="dealDirections"
                    label="Направление"
            ></v-select>

            <!--company-->
            <v-autocomplete
                    v-model="formData.company"
                    :items="companies"
                    chips
                    color="blue-grey lighten-2"
                    label="Компания"
                    item-text="TITLE"
                    item-value="ID"
                    @input="setCompany"
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

            <!--сontacts-->
            <v-autocomplete
                    v-model="formData.contact"
                    :items="contacts"
                    chips
                    color="blue-grey lighten-2"
                    label="Контакт"
                    item-text="FULL_NAME"
                    item-value="ID"
                    @input="setContact"
                    @keyup="searchContact"
            >
                <template
                        slot="selection"
                        slot-scope="data"
                >
                    <v-chip
                            :selected="data.selected"
                            close
                            class="chip--select-multi"
                            @input="contact = null"
                    >
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
                        <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.FULL_NAME"></v-list-tile-title>
                        </v-list-tile-content>
                    </template>
                </template>
            </v-autocomplete>

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

            <v-textarea
                    solo
                    v-model="formData.comments"
                    label="Комментарий"
            >

            </v-textarea>

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
        name: 'Deal',

        computed: {
            ...mapGetters([
                'baseUrl',
                'managers',
                'loading',
                'contacts',
                'companies',
                'dealGoodsGroup',
                'dealDirections'
            ])
        },

        data () {
            return {
                saveSuccess: false,
                dealLink: null,
                formData: {
                    title: '',
                    company: null,
                    contact: null,
                    responsible: null,
                    group: null,
                    direction: null,
                    comments: null
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

            setContact () {
                let selectContact = this.contacts.filter(contact => contact.ID === this.formData.contact).pop();
                let payload = {'id': selectContact['COMPANY_ID']};
                this.$store.dispatch("loadCompanies", payload);
            },

            setCompany () {
                let payload = {'companyId': this.formData.company};
                this.$store.dispatch("loadContacts", payload);
            },

            searchContact: debounce(function (e) {
                let query = e.target.value;
                if (query.length > 4) {
                    let payload = {'query': query};
                    this.$store.dispatch("loadContacts", payload)
                }
            }, 500),

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

            sendForm: async function () {

                let method = 'crm.deal.add.json';

                let params = {

                    fields: {
                        'TITLE'  : this.formData.title,
                        'EMAIL':  [
                            {
                                'VALUE_TYPE' : 'WORK',
                                'VALUE' : this.email
                            }
                        ],
                        'COMPANY_ID' : this.formData.company,
                        'CONTACT_IDS' : [this.formData.contact],
                        'ASSIGNED_BY_ID' : this.formData.responsible,
                        'COMMENTS': this.formData.comments,
                        'TYPE_ID': this.formData.direction
                    }

                };

                // set good groups
                if (this.formData.group) {
                    params.fields['UF_CRM_1543215939'] = this.formData.group;
                }

                await this.axios.post(this.baseUrl+'/'+method, params).then(response => {
                    if (response.data.result) {
                        this.dealLink = localStorage.baseUrl+'/crm/deal/show/'+response.data.result+'/';
                        this.saveSuccess = true;
                    }
                })
            }

        }

    }
</script>