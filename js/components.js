Vue.component('input-element', {
  template: "<div><div class='mb-3' v-if='!props.icon'><label :for='props.id' class='form-label'>{{props.label}}</label><input :id='props.id' :type='props.type' class='form-control' :placeholder='props.placeholder'></input></div>"+
  "<label v-if='props.icon' :for='props.id' class='form-label'>{{props.label}}</label><div v-if='props.icon' class='input-group mb-3'><span class='input-group-text'><i :class='props.icon'/></span><input :type='props.type' class='form-control' :id='props.id':placeholder='props.placeholder'></div></div>",
  props: ['props']
})
Vue.component('button-element', {
  template: '<button :class="[props.outlined ? \'btn btn-outline-\'+props.style: \'btn btn-\'+props.style]"><i :class="props.icon" v-if="props.icon"></i> {{ props.label }}</button>',
  props: ['props']
})

Vue.component('checkbox-element', {
  template: '<div class="form-check mb-1"><input class="form-check-input" type="checkbox"><label class="form-check-label">{{props.label}}</label></div>',
  props: ['props']
})

Vue.component('panel-element', {
  template: '<div class="card {{props.class}}">'+
  '<div class="card-header">{{props.title}}</div>'+
  '<div class="card-body">'+
    '<form-content :content="props.content" classname="row"></form-content>'+
  '</div>'+
'</div>',
  props: ['props']
})
Vue.component('row-element', {
  template: '<form-content :content="props.content" classname="row"></form-content>',
  props: ['props']
})