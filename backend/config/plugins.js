module.exports = ({ env }) => (
{
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('APPSLY_HOST'),
        port:env('APPSLY_PORT'),
        auth: {
          user:  env('APPSLY_EMAIL'),
          pass: env('APPSLY_EMAIL_PASS'),
        },
      },
      settings: {
        defaultFrom: env('APPSLY_EMAIL'),
        defaultReplyTo: env('APPSLY_EMAIL'),
      },
    },
    
  },
})

 
