# Royal Snack House

A premium, responsive snack storefront built with HTML, CSS and vanilla JavaScript.

## Run locally
Open `index.html` in a browser. For local hosting, run any static HTTP server from this folder.

## Current features
- Premium dark forest-green and metallic-gold brand identity
- Responsive landing page, collections, story and contact sections
- Sample snack catalogue with category filters and search
- Shopping bag with quantity controls and automatic totals
- WhatsApp order and enquiry message builder
- Browser localStorage for the demo shopping bag

## Configure before launch
1. Replace sample snack products, prices, pack sizes, descriptions and food photos in `script.js`.
2. Set `STORE.whatsappNumber` in `script.js` to the business WhatsApp number, including country code and digits only.
3. Add the correct store address and business contact details in `index.html`.
4. Verify that all product photography is owned or licensed for commercial use.

## Important production work
This repository currently contains a front-end prototype. It does not yet include secure customer accounts, a server-side database, secure admin login, persistent order management, payment gateway integration or live order tracking. Those require a backend and credentials; do not accept payment based on the demo UI.

## Deployment
This is a static site. In Render, create a **Static Site**, connect this repository, set the branch to `main`, leave the build command empty, and set the publish directory to `.`. Enable Auto-Deploy.
