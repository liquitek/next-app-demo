This Next.js app tries to pull all the embedded audio players from bandcamp.com associated with an artist alias and a bandcamp domain entered by user and display them on the page using Next.js feature Server Actions.

Of course data fetching and processing can be performed on client side, and probably with less efforts as dom parser can be used instead of regex. But why not to test the idea and see how this all works when several users make the requests?

app/actions.js is where the data fetching and processing happens.

app/ExternalData.js for the client side of things.

npm install

npm run build

npm run start

or

npm install

npm run dev

or just copy the contents of the app folder into your newly created nextjs app and run the dev server.








