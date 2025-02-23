import React from 'react'
import { useParams } from 'react-router-dom'

import { PageLayout } from '@/app/components/PageLayout'
import { BountyMain } from '@/app/pages/Bounty/components/BountyMain'
import { BountyPreviewHeader } from '@/bounty/components/BountyPreviewHeader/BountyPreviewHeader'
import { BountyRouteParams } from '@/bounty/constants'
import { useBounty } from '@/bounty/hooks/useBounty'
import { Loading } from '@/common/components/Loading'

export const Bounty = () => {
  const { id } = useParams<BountyRouteParams>()
  const { isLoading, bounty } = useBounty(id)

  if (isLoading || !bounty) {
    return <Loading />
  }

  return <PageLayout main={<BountyMain bounty={bounty} />} header={<BountyPreviewHeader bounty={bounty} />} />
}
