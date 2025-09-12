const myAppConfig = {
  auth: {
    domain: 'dev-caumwi3vx0hpzdnd.us.auth0.com',
    clientId: 'hoRd1Twrdra3MoekYTaB2wQ31jthUaWA',
    authorizationParams: {
      //redirect_uri: 'http://localhost:4200',
      redirect_uri: 'https://localhost:4200/login/callback',
      //redirect_uri: window.location.origin,
      //redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      //redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200',
      audience: 'http://localhost:8080',
    },
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase',
    ],
  },
};

export default myAppConfig;