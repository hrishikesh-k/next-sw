import type { PropsWithChildren } from 'react'
import Sw from '~/components/sw.tsx'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export default function (props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        {props.children}
        <br />
        <Sw />
      </body>
    </html>
  )
}
