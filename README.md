# LeadCallr Voice AI ROI Calculator

A lead qualification wizard that calculates potential ROI for real estate agents considering Voice AI.

## Quick Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your repo
4. Click "Deploy"
5. Done! You'll get a URL like `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Navigate to this folder
cd leadcallr-wizard-nextjs

# Deploy
vercel

# Follow the prompts
```

## Embed in GHL

Once deployed, add this to your GHL funnel page using a **Custom Code** or **HTML** element:

```html
<iframe 
  src="https://your-project.vercel.app" 
  width="100%" 
  height="1400" 
  frameborder="0"
  style="border: none; max-width: 800px; margin: 0 auto; display: block;">
</iframe>
```

**Tip:** Adjust the `height` value based on how the wizard displays on your page.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customization

- **Benchmarks:** Edit the `BENCHMARKS` object in `app/page.js`
- **Styling:** Edit `app/globals.css` for global styles
- **CTA Links:** Search for "Start a Free Trial" in `app/page.js` to update the button link

## Sending Form Data to GHL

To capture leads in GHL, you'll want to POST the form data to a GHL webhook. Update the `handleSubmitContact` function in `app/page.js`:

```javascript
const handleSubmitContact = async () => {
  // Send to GHL webhook
  await fetch('YOUR_GHL_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      // Add any other fields you want to capture
    })
  });

  // Continue with results calculation
  const calculatedResults = calculateResults();
  setResults(calculatedResults);
  nextStep();
  setTimeout(() => setShowResults(true), 500);
};
```
