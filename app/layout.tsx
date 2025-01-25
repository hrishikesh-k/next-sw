import type { PropsWithChildren } from 'react'
import Sw from '~/components/sw.tsx'

export default function (props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        {props.children}
        <Sw />
      </body>
    </html>
  )
}
