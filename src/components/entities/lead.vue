<template>
    <v-app id="lead" >
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Имя"
                    required
            ></v-text-field>

            <v-text-field
                    v-model="lastname"
                    :rules="lastnameRules"
                    label="Фамилия"
                    required
            ></v-text-field>

            <v-select
                    v-model="company"
                    :items="companies"
                    label="Компания"
                    required
            ></v-select>

            <v-select
                    v-model="contact"
                    :items="contacts"
                    label="Контакт"
                    required
            ></v-select>

            <v-autocomplete
                    v-model="responsible"
                    :items="managers"
                    chips
                    color="blue-grey lighten-2"
                    label="Менеджер"
                    item-text="name"
                    item-value="name"
            >
                <template
                        slot="selection"
                        slot-scope="data"
                >
                    <v-chip
                            :selected="data.selected"
                            close
                            class="chip--select-multi"
                            @input="remove()"
                    >
                        <v-avatar>
                            <img :src="data.item.avatar">
                        </v-avatar>
                        {{ data.item.name }}
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
                            <img :src="data.item.avatar">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
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

    export default {
        name: 'Lead',
        computed: {
            managersStore() {
                return this.$store.state.baseUrl;
            }
        },
        data () {

            const srcs = {
                1: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
                2: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
                3: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
                4: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
                5: 'https://cdn.vuetifyjs.com/images/lists/5.jpg'
            };

            return {
                userAccess: false,
                valid: true,
                name: '',
                company: null,
                contact: null,
                lastname: '',
                responsible: null,

                nameRules: [
                    v => !!v || 'Имя обязательно'
                ],
                lastnameRules: [
                    v => !!v || 'Фамилия обязательна'
                ],

                companies: [
                    'Компания 1',
                    'Компания 2',
                    'Компания 3',
                    'Компания 4'
                ],
                contacts: [
                    'Контакт 1',
                    'Контакт 2',
                    'Контакт 3',
                    'Контакт 4'
                ],

                managers: [
                    { header: 'Group 1' },
                    { name: 'Sandra Adams', group: 'Group 1', avatar: srcs[1] },
                    { name: 'Ali Connors', group: 'Group 1', avatar: srcs[2] },
                    { name: 'Trevor Hansen', group: 'Group 1', avatar: srcs[3] },
                    { name: 'Tucker Smith', group: 'Group 1', avatar: srcs[2] },
                    { divider: true },
                    { header: 'Group 2' },
                    { name: 'Britta Holt', group: 'Group 2', avatar: srcs[4] },
                    { name: 'Jane Smith ', group: 'Group 2', avatar: srcs[5] },
                    { name: 'John Smith', group: 'Group 2', avatar: srcs[1] },
                    { name: 'Sandra Williams', group: 'Group 2', avatar: srcs[3] }
                ],
                checkbox: false
            }
        },
        methods: {
            validate () {
                if (this.$refs.form.validate()) {
                    this.snackbar = true
                }
            },
            reset () {
                this.$refs.form.reset()
            },
            remove () {
                this.responsible = null;
            },

        },

        created: function() {
            this.$store.dispatch('loadManagers') // dispatch loading
        }
    }
</script>