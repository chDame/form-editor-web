Vue.component('display-comp', {
  template: '<div class="input-group mb-1 half">'+
				'<span :class="\'input-group-text bi bi-\'+icon"></span>'+
				'<input type="number" class="form-control" required v-model="$store.state.currentField.props[property]" min=1 max=12>'+
			'</div>',
  props: ['icon', 'property']
})
Vue.component('prop-component', {
  template: "<component v-if='display' :is='\"prop-\"+propdef.type' :propdef='propdef'></component>",
  props: ['propdef'],
  data(){
  	return {
    	condition:this.propdef.condition,
		field:this.$store.state.currentField
    }
  },
  computed:{
  	display(){
    	with(this){
      	try{
			if (!condition) {
				return true;
			}
        	return eval(condition);
        } catch(error){
        	console.log(error.message);
        }      	
      }
    }
  }
})

Vue.component('prop-text', {
  template: "<div><label :class='labelClass'>{{propdef.name}}</label><div class='input-group mb-1'><span class='input-group-text'>abc</span><input type='text' class='form-control' v-model='$store.state.currentField.props[propdef.name]'></div></div>",
  props: ['propdef'],
  computed:{
	labelClass(){
		if (this.propdef.required) {
			return 'form-label required';
		}
		return 'form-label';
	}
  }
})
Vue.component('prop-number', {
  template: "<div><label class='form-label'>{{propdef.name}}</label><div class='input-group mb-1'><span class='input-group-text'>123</span><input type='number' class='form-control' v-model='$store.state.currentField.props[propdef.name]'></div></div>",
  props: ['propdef'],
})
Vue.component('prop-boolean', {
  template: "<div class='form-check mb-1'><input class='form-check-input' type='checkbox' v-model='$store.state.currentField.props[propdef.name]'><label class='form-check-label'>{{propdef.name}}</label></div>",
  props: ['propdef']
})
Vue.component('prop-list', {
  template: "<div class='mb-1'><label class='form-label'>{{propdef.name}}</label><select class='form-select' v-model='$store.state.currentField.props[propdef.name]'><option v-for='(value, i) in propdef.values'>{{value}}</option></select></div>",
  props: ['propdef']
})