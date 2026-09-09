'use client'

import dynamic from 'next/dynamic'

const SanityStudio = dynamic(() => import('@/components/SanityStudio'), {
  ssr: false,
  loading: () => <div style={{minHeight: '100dvh', background: '#101112'}} />,
})

export default SanityStudio
