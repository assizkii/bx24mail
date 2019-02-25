<template>
    <v-app id="task">
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
                Задача создана.     <v-btn target="_blank" :href="taskLink" color="success">Открыть</v-btn>
            </v-alert>

            <!--name-->
            <v-text-field
                    v-model="formData.title"
                    :rules="titleRules"
                    label="Название"
                    required
            ></v-text-field>

            <v-textarea
                    solo
                    v-model="formData.description"
                    label="Описание задачи"
            >

            </v-textarea>


            <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="date"
                    persistent
                    lazy
                    full-width
                    width="290px"
            >
                <v-text-field
                        slot="activator"
                        v-model="formData.deadline"
                        label="Крайний срок"
                        prepend-icon="event"
                        readonly
                ></v-text-field>
                <v-date-picker v-model="date" scrollable  locale="ru-RU">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modal = false">Отмена</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialog.save(date)">Ок</v-btn>
                </v-date-picker>
            </v-dialog>

            <!--company-->
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

            <!--сontacts-->
            <v-autocomplete
                    v-model="formData.contact"
                    :items="contacts"
                    chips
                    color="blue-grey lighten-2"
                    label="Контакт"
                    item-text="FULL_NAME"
                    item-value="ID"
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
                            @input="formData.contact = null"
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
        name: 'Task',

        computed: {
            ...mapGetters([
                'managers',
                'loading',
                'contacts',
                'companies',
                'baseUrl'
            ])
        },

        data () {
            return {

                date: new Date().toISOString().substr(0, 10),

                modal: false,
                formData: {
                    title: '',
                    company: null,
                    contact: null,
                    responsible: null,
                    description: '',
                    deadline:  this.formatDate(new Date().toISOString().substr(0, 10)),
                },

                userAccess: false,

                valid: true,

                titleRules: [
                    v => !!v || 'Название обязательно'
                ],

            }
        },

        watch: {
            date (val) {
                this.formData.deadline = this.formatDate(this.date)
            }
        },

        methods: {

            validate () {
                if (this.$refs.form.validate()) {
                    this.snackbar = true;
                    this.sendForm();
                }
            },

            formatDate (date) {
                if (!date) return null;

                const [year, month, day] = date.split('-');
                return `${day}.${month}.${year}`
            },

            searchManager: debounce(function (e) {
                let query = e.target.value;
                if (query.length > 4) {
                    let payload = {'query': query};
                    this.$store.dispatch("loadManagers", payload)
                }
            }, 500),

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

            sendForm: async function () {

                let method = 'task.item.add.json';

                let params = [{
                    'TITLE' : this.formData.title,
                    'DESCRIPTION': this.formData.description,
                    'DEADLINE': this.formData.deadline,
                    'UF_CRM_TASK' : [
                        'C_'+this.formData.contact,
                        'CO_'+this.formData.company
                    ],
                    'RESPONSIBLE_ID' : this.formData.responsible

                }];

                await this.axios.post(this.baseUrl+'/'+method, params).then(response => {
                    let data = response.data.result;
                    this.$refs.form.reset()
                })
            }

        }
    }
</script>