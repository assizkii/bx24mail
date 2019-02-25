import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);
Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    email : 'n-kis@bitrix24.ru',
    name: '',
    leads: [],
    loading: true,
    managers: [],
    baseUrl: '',
    scope: [],
    contacts: [],
    companies: [],
    counter: {
        leads:0,
        companies:0,
        contacts:0
    },
    dealGoodsGroup: [],
    dealDirections: []
};

// mutations are operations that actually mutates the state.
// for debugging purposes.
const mutations = {

    updateBaseUrl(state, url) {
        state.baseUrl = url
    },

    updateScope(state, scope) {
        state.scope = scope;
    },

    updateManagers(state, managers) {
        state.managers = managers
    },

    updateContacts(state, contacts) {
        state.contacts = contacts
    },

    updateCompanies(state, companies) {
        state.companies = companies
    },

    changeLoadingState(state, loading) {
        state.loading = loading
    },

    clearData(state) {
        state.contacts = [];
        state.companies = [];
    },

    updateEmail(state, email) {
        state.email = email
    },

    updateName(state, name) {
        state.name = name
    },

    updateLeads(state, leads) {
        state.leads = leads
    },

    updateCounter(state, countInfo) {
        if (countInfo.leads !== undefined ) {
            state.counter.leads = countInfo.leads;
        }
        if (countInfo.contacts !== undefined) {
            state.counter.contacts = countInfo.contacts;
        }
        if (countInfo.companies !== undefined) {
            state.counter.companies = countInfo.companies
        }
    },

    getDealGoodsGroup(state, groups) {
        state.dealGoodsGroup = groups
    },

    getDealDirections(state, directions) {
        state.dealDirections = directions
    },

};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {

    clearData({commit}) {
        commit('clearData')
    },

    setBaseUrl({commit}, url) {
        commit('updateBaseUrl', url)
    },

    setEmail({commit}, email) {
        commit('updateEmail', email)
    },

    setName ({commit}, name) {
        commit('updateName', name)
    },

    init: async (context) => {

        context.commit('changeLoadingState', true);

        let params = {
            select: ['ID', 'NAME', 'LAST_NAME', 'TITLE'],
            filter: { 'EMAIL': state.email}
        };

        await axios.post(state.baseUrl+'/crm.contact.list.json', params).then(response => {
            context.commit('updateContacts', response.data.result);
            context.commit('updateCounter', {contacts: response.data.result.length});
        });

        await axios.post(state.baseUrl+'/crm.company.list.json', params).then(response => {
            context.commit('updateCompanies', response.data.result);
            context.commit('updateCounter', {companies: response.data.result.length});
        });

        await axios.post(state.baseUrl+'/crm.lead.list.json', params).then(response => {
            context.commit('updateLeads', response.data.result);
            context.commit('updateCounter', {leads: response.data.result.length});
        })
    },

    // load hook scope
    loadScope: async (context) => {

        if (!state.scope.length) {
            context.commit('changeLoadingState', true);

            await axios.get(state.baseUrl+'/scope/').then(response => {

                context.commit('updateScope', response.data.result);
                context.commit('changeLoadingState', false)
            })
        }
    },

    // load managers list
    loadManagers: async (context, payload) => {

        context.commit('changeLoadingState', true);
        let params = {
            ACTIVE : 'Y',
            FIND : payload.query
        };
        await axios.get(state.baseUrl+'/user.search.json', {params}).then(response => {
            context.commit('updateManagers', response.data.result);
            context.commit('changeLoadingState', false)
        })

    },

    loadUser: async (context, payload) => {
        context.commit('changeLoadingState', true);
        let params = {
            select: ['ID', 'NAME', 'LAST_NAME'],
            filter: { 'ID': payload.id }
        };

        await axios.post(state.baseUrl+'/user.get', params).then(response => {
            context.commit('updateManagers', response.data.result);
            context.commit('changeLoadingState', false)
        })
    },

    // load contacts list
    loadContacts: async (context, payload) => {
        context.commit('changeLoadingState', true);
        let params = {
            select: ['ID', 'NAME', 'LAST_NAME', 'COMPANY_ID'],
            filter: { '%LAST_NAME': payload.query }
        };
        if (payload.companyId !== undefined) {
            params.filter['COMPANY_ID'] = payload.companyId;
        }
        await axios.post(state.baseUrl+'/crm.contact.list.json', params).then(response => {
            context.commit('updateContacts', response.data.result);
            context.commit('changeLoadingState', false)
        })
    },

    // load companies list
    loadCompanies: async (context, payload) => {
        context.commit('changeLoadingState', true);
        let params = {
            select: ['TITLE', 'ID'],
            filter: { '%TITLE': payload.query }
        };

        if (payload.id !== undefined) {
            params.filter['ID'] = payload.id;
        }
        await axios.post(state.baseUrl+'/crm.company.list.json', params).then(response => {
            context.commit('updateCompanies', response.data.result);
            context.commit('changeLoadingState', false)
        })
    },

    loadDealGoodGroups: async (context) => {

        if (!state.dealGoodsGroup.length) {
            context.commit('changeLoadingState', true);

            let params = {
                id : '897',
            };

            await axios.post(state.baseUrl+'/crm.deal.userfield.get.json', params).then(response => {
                context.commit('getDealGoodsGroup', response.data.result);
            })
        }
    },

    loadDealDirections: async (context) => {
        if (!state.dealDirections.length) {
            context.commit('changeLoadingState', true);

            let params = {
                select : ['STATUS_ID', 'NAME'],
                filter: { 'ENTITY_ID': 'DEAL_TYPE' }
            };

            await axios.post(state.baseUrl+'/crm.status.list.json', params).then(response => {
                context.commit('getDealDirections', response.data.result);
            })
        }
    }

};

// getters are functions
const getters = {

    baseUrl(state) {
        return state.baseUrl
    },

    scope(state) {
       return state.scope
    },

    managers(state) {
      return  state.managers
          .map( (manager) => {
                manager.FULL_NAME = manager.NAME + " " +manager.LAST_NAME
                return manager
         });
    },

    contacts(state) {
        return  state.contacts
            // .filter(contact => contact.NAME)
            .map( (contact) => {
                contact.FULL_NAME = contact.NAME + " " +contact.LAST_NAME
                return contact
            });
    },

    companies(state) {
        return state.companies
    },

    leads(state) {
        return  state.leads
        // .filter(contact => contact.NAME)
            .map( (lead) => {
                lead.FULL_NAME = lead.NAME + " " +lead.LAST_NAME
                return lead
            });
    },

    email(state) {
        return state.email
    },

    name(state) {
        return state.name
    },


    counter(state) {
        return state.counter
    },

    dealGoodsGroup(state) {
        return  state.dealGoodsGroup.LIST
                .map( (groups) => {
                    let group = {
                        value : groups.ID,
                        text: groups.VALUE,
                    };
                    return group
                });
    },

    dealDirections(state) {
        return  state.dealDirections
                .map( (status) => {
                    let type = {
                        value : status.STATUS_ID,
                        text: status.NAME,
                    };
                    return type
                 });
    }

};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})