import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import router from './router'
import store from './store'

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
Amplify.configure({
  Auth: {
      identityPoolId: 'us-east-1:05d53d1f-4f8c-46a5-bb76-c60884511adb', //REQUIRED - Amazon Cognito Identity Pool ID
      region: 'us-east-1', // REQUIRED - Amazon Cognito Region
  },
  Storage: {
      bucket: 'b2-photos2', //REQUIRED -  Amazon S3 bucket
      region: 'us-east-1', //OPTIONAL -  Amazon service region
  },
  API: {
    endpoints: [
        {
          "name": "search",
          "endpoint": "https://u5w2x1g7al.execute-api.us-east-1.amazonaws.com/PROD",
          "region": "us-east-1"
        }
    ]
}
}
);

Vue.use(AmplifyPlugin, AmplifyModules)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
