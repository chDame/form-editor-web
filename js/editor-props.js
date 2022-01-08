Vue.component('prop-text', {
  template: "<div><label class='form-label'>{{propdef.name}}</label><div class='input-group mb-1'><span class='input-group-text'>abc</span><input type='text' class='form-control' v-model='$store.state.currentField.props[propdef.name]'></div></div>",
  props: ['propdef']
})
Vue.component('prop-number', {
  template: "<div><label class='form-label'>{{propdef.name}}</label><div class='input-group mb-1'><span class='input-group-text'>123</span><input type='number' class='form-control' v-model='$store.state.currentField.props[propdef.name]'></div></div>",
  props: ['propdef']
})
Vue.component('prop-boolean', {
  template: "<div class='form-check mb-1'><input class='form-check-input' type='checkbox' v-model='$store.state.currentField.props[propdef.name]'><label class='form-check-label'>{{propdef.name}}</label></div>",
  props: ['propdef']
})
Vue.component('prop-list', {
  template: "<div class='mb-1'><label class='form-label'>{{propdef.name}}</label><select class='form-select' v-model='$store.state.currentField.props[propdef.name]'><option v-for='(value, i) in propdef.values'>{{value}}</option></select></div>",
  props: ['propdef']
})