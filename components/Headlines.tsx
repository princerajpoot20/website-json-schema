import React from 'react'
import classnames from 'classnames'
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline'
import { useRouter } from 'next/router'
import { HOST } from '~/lib/config'

type HeadlineProps = { children: string | React.ReactNode[], attributes?: Record<string, any> }

export const Headline1 = ({ children, attributes }: HeadlineProps) => <Headline Tag={Headline1Tag} attributes={attributes}>{children}</Headline>
export const Headline2 = ({ children, attributes }: HeadlineProps) => <Headline Tag={Headline2Tag} {...attributes}>{children}</Headline>
export const Headline3 = ({ children, attributes }: HeadlineProps) => <Headline Tag={Headline3Tag} {...attributes}>{children}</Headline>
export const Headline4 = ({ children, attributes }: HeadlineProps) => <Headline Tag={Headline4Tag} {...attributes}>{children}</Headline>

const Headline = ({ children, Tag, attributes: propAttributes }: {
  children: string | React.ReactNode[]
  Tag: React.FunctionComponent<TagProps>
  attributes?: Record<string, any>
}) => {
  const router = useRouter()
  const asPath = router.asPath
  const slug = slugifyMarkdownHeadline(children as any[])

  const attributes = {
    ...propAttributes,
    id: slug,
    className: classnames('group cursor-pointer hover:underline', propAttributes?.className),
    onClick: () => {
      const url = new URL(asPath, HOST)
      // recalculation necessary because of scope issue
      const slug = slugifyMarkdownHeadline(children as any[])
      url.hash = `#${slug}`

      const urlString = url.toString().substr(HOST.length, Infinity)
      window.location.href = urlString
    }
  }
  const childredWithoutFragment = filterFragment(children)
  return (
    <Tag attributes={attributes}>
      {childredWithoutFragment}
      <span className='text-slate-300 inline-block ml-2 opacity-0 group-hover:opacity-100'>¶</span>
    </Tag>
  )
}

const filterFragment = (children: string | React.ReactNode[]) => {
  return (typeof children === 'string' ? [children] : children).map(child => {
    if (typeof child !== 'string') return child
    return child.replace(/\[#(\w|-|_)*\]/g, '')
  })
}

type TagProps = { children: React.ReactNode, attributes: Record<string, any> }

const Headline1Tag = ({ children, attributes }: TagProps) => (
  <h1 {...attributes} className={classnames(attributes?.className, 'text-4xl font-bold pt-10 mb-6')}>{children}</h1>
)
const Headline2Tag = ({ children, attributes }: TagProps) => (
  <h2 {...attributes} className={classnames(attributes?.className, 'text-2xl font-semibold mt-10 mb-4')}>{children}</h2>
)
const Headline3Tag = ({ children, attributes }: TagProps) => (
  <h3 {...attributes} className={classnames(attributes?.className, 'text-xl font-semibold mt-6 mb-3')}>{children}</h3>
)
const Headline4Tag = ({ children, attributes }: TagProps) => (
  <h4 {...attributes} className={classnames(attributes?.className, 'font-semibold mt-4 mb-2')}>{children}</h4>
)
