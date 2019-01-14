<template>
    <v-app id="task">
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >

            <!--name-->
            <v-text-field
                    v-model="formData.title"
                    :rules="titleRules"
                    label="Название"
                    required
            ></v-text-field>

            <!--company-->
            <v-autocomplete
                    v-bind:disabled="formData.contact"
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
                    v-bind:disabled="formData.company"
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
        name: 'Task',

        computed: {
            ...mapGetters([
                'managers',
                'loading',
                'contacts',
                'companies'
            ])
        },

        data () {
            return {

                formData: {
                    title: '',
                    company: null,
                    contact: null,
                    responsible: null,
                    type: null,
                    direction: null
                },

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

            setContact () {
                this.formData.company = null;
            },

            setCompany () {
                this.formData.contact = null;
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
            }, 500)

        },

        created: function() {
            this.$store.dispatch("loadManagers");
        }
    }
</script>