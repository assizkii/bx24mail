<template>
    <v-app id="inspire">
        <v-navigation-drawer
                v-model="drawer"
                hide-overlay
                stateless
                app
                mt-5
                width="180"
                :mini-variant.sync="mini"
        >
            <v-list dense>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Lead')">
                    <v-list-tile-action>
                        <v-badge right  color="primary">
                            <span slot="badge" v-if="counter.leads > 0">
                                {{counter.leads}}
                              </span>
                            <v-icon v-if="counter.leads"
                                    slot="badge"
                                    dark
                                    small
                            ></v-icon>
                            <v-icon large>accessibility</v-icon>
                        </v-badge>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Лид</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Contact')">
                    <v-list-tile-action>
                        <v-badge right  color="primary">
                            <span slot="badge" v-if="counter.contacts > 0">
                                {{counter.contacts}}
                              </span>
                            <v-icon v-if="counter.contacts > 0"
                                    slot="badge"
                                    dark
                                    small
                            ></v-icon>
                            <v-icon large>account_box</v-icon>
                        </v-badge>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Контакт </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Company')">
                    <v-list-tile-action>
                        <v-badge right  color="primary">
                            <span slot="badge" v-if="counter.companies > 0">
                                {{counter.companies}}
                              </span>
                            <v-icon v-if="counter.companies > 0"
                                    slot="badge"
                                    dark
                                    small
                            ></v-icon>
                            <v-icon large>supervisor_account</v-icon>
                        </v-badge>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Компания</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Deal')">
                    <v-list-tile-action>
                        <v-icon large>work</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Сделка</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Quote')">
                    <v-list-tile-action>
                        <v-icon large>contact_mail</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Предложение</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='taskAccess' v-on:click="changeComponent('Task')">
                    <v-list-tile-action>
                        <v-icon large>done</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Задача</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-on:click="changeComponent('Settings')">
                    <v-list-tile-action>
                        <v-icon large>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Настройки</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-container fluid fill-height>
                <v-layout justify-center align-center>

                    <v-flex text-xs-left>
                        <v-card v-if="selectComponent !== 'Settings' && selectComponent !== 'Task'">
                            <v-card-title primary-title>
                                <div>
                                    <h2>{{componentsName[selectComponent]}}</h2>
                                    <h3 class="headline mb-0">{{name}}</h3>
                                    <div>{{email}}</div>
                                </div>
                            </v-card-title>
                        </v-card>
                        <component :is="selectComponent" v-if="selectComponent"></component>
                    </v-flex>
                </v-layout>
            </v-container>
    </v-app>
</template>

<script>

    import Lead from './entities/lead'
    import Contact from './entities/contact'
    import Company from './entities/company'
    import Deal from './entities/deal'
    import Quote from './entities/quote'
    import Task from './entities/task'
    import Settings from './entities/settings'
    import { mapGetters } from 'vuex'



    export default {
        name: 'Base',

        components: {
            Lead, Contact, Company, Deal, Quote, Task, Settings
        },

        computed: {
            ...mapGetters([
                'scope',
                'loading',
                'contacts',
                'companies',
                'leads',
                'counter',
                'email',
                'name'
            ])
        },

        data: () => ({
            mini: true,
            drawer: true,
            selectComponent: null,
            crmAccess: false,
            taskAccess: false,
            componentsName: {
                'Lead': 'Лид',
                'Contact': 'Контакт',
                'Company': 'Компания',
                'Deal': 'Сделка',
                'Quote': 'Предложение',
                'Task': 'Задача',
                'Setting': 'Настройки'
            }
        }),

        methods: {
            changeComponent: function (componentName) {
                this.selectComponent = componentName;
                this.mini = true;
            }
        },

        created() {
            this.$store.dispatch("loadScope").then(() => {
                if (this.scope.indexOf('crm') !== -1) {
                    this.crmAccess = true;
                    this.$store.dispatch("init");
                    this.$store.dispatch('loadDealGoodGroups');
                    this.$store.dispatch('loadDealDirections');
                }
                if (this.scope.indexOf('task') !== -1) {
                    this.taskAccess = true
                }
            })
        },


    }
</script>
<style>

</style>