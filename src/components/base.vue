<template>
    <v-app id="inspire">
        <v-navigation-drawer
                v-model="drawer"
                fixed
                left
                app
                mt-10
        >
            <v-list dense>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Lead')">
                    <v-list-tile-action>
                        <v-badge right  color="purple" >
                            <v-icon
                                    slot="badge"
                                    dark
                                    small
                            >done</v-icon>
                            <v-icon large>accessibility</v-icon>
                        </v-badge>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Лид</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Contact')">
                    <v-list-tile-action>
                        <v-icon large>account_box</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Контакт</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if='crmAccess' v-on:click="changeComponent('Company')">
                    <v-list-tile-action>
                        <v-icon large>supervisor_account</v-icon>
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
        <v-toolbar color="cyan" dark left fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>BX24 Gmail</v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center align-center>

                    <v-flex text-xs-left>
                        <v-card>
                            <v-card-title primary-title>
                                <div>
                                    <h3 class="headline mb-0">Иванов Иван Викторович</h3>
                                    <div>ivan@ivan.ru</div>
                                </div>
                            </v-card-title>
                        </v-card>
                        <component :is="selectComponent" v-if="selectComponent"></component>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer color="cyan" app>
            <v-spacer></v-spacer>
            <span class="white--text">&copy; 2017</span>
        </v-footer>
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

    import { mapState } from 'vuex'

    export default {
        name: 'Base',
        components: {
            Lead, Contact, Company, Deal, Quote, Task, Settings
        },
        computed: mapState({
            scope: state => state.scope,
            loading: state => state.loading,
        }),
        data: () => ({
            drawer: null,
            selectComponent: null,
            crmAccess: false,
            taskAccess: false,
        }),
        methods: {
            changeComponent: function (componentName) {
                this.selectComponent = componentName;
            },
        },
        mounted() {

        },

        created() {
            this.$store.dispatch("loadScope").then(() => {
                if (this.scope.indexOf('crm') !== -1) {
                    this.crmAccess = true;
                }
                if (this.scope.indexOf('task') !== -1) {
                    this.taskAccess = true
                }
            })
        }
    }
</script>