Vue.component('prop-text', {
  template: "<div v-if='display'><label class='form-label'>{{propdef.name}}</label><div class='input-group mb-1'><span class='input-group-text'>abc</span><input type='text' class='form-control' v-model='$store.state.currentField.props[propdef.name]'></div></div>",
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
Vue.component('prop-number', {
  template: "<div v-if='display'><label class='form-label'>{{propdef.name}}</label><div class='input-group mb-1'><span class='input-group-text'>123</span><input type='number' class='form-control' v-model='$store.state.currentField.props[propdef.name]'></div></div>",
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
Vue.component('prop-boolean', {
  template: "<div v-if='display' class='form-check mb-1'><input class='form-check-input' type='checkbox' v-model='$store.state.currentField.props[propdef.name]'><label class='form-check-label'>{{propdef.name}}</label></div>",
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
Vue.component('prop-list', {
  template: "<div v-if='display' class='mb-1'><label class='form-label'>{{propdef.name}}</label><select class='form-select' v-model='$store.state.currentField.props[propdef.name]'><option v-for='(value, i) in propdef.values'>{{value}}</option></select></div>",
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