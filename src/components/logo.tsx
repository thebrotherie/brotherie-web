'use client'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  src: string
  alt: string
  href?: string            // optional link destination
  width?: number           // defaults 140
  height?: number          // defaults auto
  title?: string           // hover tooltip
  darkSrc?: string         // swap in dark mode if provided
  className?: string
}

/** One-liner logo renderer, link-wrapper optional */
export default function Logo({
  src,
  alt,
  href,
  width = 140,
  height,
  title,
  darkSrc,
  className = '',
}: Props) {
  const Img = (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={`${className} ${darkSrc ? 'block dark:hidden' : ''}`}
      priority
    />
  )

  const ImgDark = darkSrc && (
    <Image
      src={darkSrc}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={`hidden dark:block ${className}`}
      priority
    />
  )

  const content = (
    <>
      {Img}
      {ImgDark}
    </>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
