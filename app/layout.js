
import './globals.css'
import { Roboto_Flex } from 'next/font/google';

const robotoFlex = Roboto_Flex({ subsets: ['latin','cyrillic-ext'], display: 'swap',variable: '--font-roboto-flex'});


export const metadata = {
  title: 'the Title',
  description: 'the Description',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={robotoFlex.className}><Layout>{children}</Layout></body>
    </html>
  )
}

function Header({children}) {
  return(<header>{children}</header>)
}
function Footer({children}) {
  return(<footer>{children}</footer>)
}


function Layout({ children }) {
    return (
      <div id="page_wrapper" className="flex flex-col min-h-screen">
        <Header>
          <div className="p-4">
            <h1 className="text-center text-2xl">This app tries to pull a bunch of <a href="https://bandcamp.com" target='_blank' className="text-sky-500 hover:underline">bandcamp.com</a> audio players based on bandcamp domain (the default is <a href="https://kosmosmusicru.bandcamp.com" target="_blank" className='text-sky-500 hover:underline'>kosmosmusicru.bandcamp.com</a>)  and the artist alias. Try "Liquitek" to see how it works.</h1>
          </div>
        </Header>
        <main className="grow flex">{children}</main>
        <Footer>
          <div className="p-4">
            <h2 className="text-center text-xl">Thanks for listening;)</h2>
          </div>
        </Footer>
      </div>
  ) 
 }