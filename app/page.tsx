import Image from 'next/image'
import Link from 'next/link'

export default function () {
  return (
    <>
      <h1>Home</h1>
      <br />
      <Link href="/page-1">Page-1</Link>
      <Image
        src="https://images.pexels.com/photos/16933824/pexels-photo-16933824.jpeg"
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </>
  )
}
