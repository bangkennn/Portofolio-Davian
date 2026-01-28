# Deployment Environment Variables

## Required Environment Variables on Vercel

Before deploying to Vercel, you MUST add these environment variables in your Vercel project settings:

### Supabase Configuration
1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### EmailJS Configuration
1. `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - Your EmailJS service ID
2. `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - Your EmailJS template ID  
3. `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` - Your EmailJS public key

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add each variable listed above with their corresponding values from your `.env.local` file
5. Make sure to add them for **Production**, **Preview**, and **Development** environments
6. After adding all variables, **redeploy** your application

## Getting Your Configuration Values

### Supabase
- Go to https://supabase.com/dashboard
- Select your project
- Go to **Settings** > **API**
- Copy the **Project URL** and **anon/public key**

### EmailJS
- Go to https://dashboard.emailjs.com/
- Navigate to your service and get the Service ID
- Navigate to your email template and get the Template ID
- Go to **Account** > **API Keys** to get your Public Key

## Local Development

For local development, copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials.
