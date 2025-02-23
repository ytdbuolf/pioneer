import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types'
import React from 'react'
import { ActorRef, State } from 'xstate'

import { SelectedAccount } from '@/accounts/components/SelectAccount'
import { useMyAccounts } from '@/accounts/hooks/useMyAccounts'
import { accountOrNamed } from '@/accounts/model/accountOrNamed'
import { ButtonPrimary } from '@/common/components/buttons'
import { InputComponent } from '@/common/components/forms'
import { Arrow } from '@/common/components/icons'
import { ModalBody, ModalFooter, TransactionInfoContainer } from '@/common/components/Modal'
import { TransactionInfo } from '@/common/components/TransactionInfo'
import { TextInlineMedium, TextMedium, TokenValue } from '@/common/components/typography'
import { useModal } from '@/common/hooks/useModal'
import { useSignAndSendTransaction } from '@/common/hooks/useSignAndSendTransaction'
import { TransactionModal } from '@/common/modals/TransactionModal'
import { TransactionEvent } from '@/common/model/machines'
import { VotingAttempt } from '@/council/hooks/useCommitment'
import { TransactionContext } from '@/proposals/modals/AddNewProposal/machine'

import { RevealVoteModalCall } from '.'

interface Props {
  service: ActorRef<TransactionEvent, State<TransactionContext>>
  transaction: SubmittableExtrinsic<'rxjs', ISubmittableResult>
  vote: VotingAttempt
}

export const RevealVoteSignModal = ({ service, transaction, vote }: Props) => {
  const { hideModal, modalData } = useModal<RevealVoteModalCall>()
  const { allAccounts } = useMyAccounts()
  const { voteForHandle } = modalData
  const { accountId } = vote

  const { sign, isReady, paymentInfo } = useSignAndSendTransaction({
    service,
    transaction,
    signer: accountId,
  })

  return (
    <TransactionModal onClose={hideModal} service={service}>
      <ModalBody>
        <TextMedium light>
          You intend to reveal your vote for <TextInlineMedium bold>{voteForHandle}</TextInlineMedium>.
        </TextMedium>
        <TextMedium light>
          Fees of <TokenValue value={paymentInfo?.partialFee.toBn()} /> will be applied to the transaction.
        </TextMedium>

        <InputComponent label="Fee sending from account" inputSize="l">
          <SelectedAccount account={accountOrNamed(allAccounts, accountId, 'Account')} />
        </InputComponent>
      </ModalBody>

      <ModalFooter>
        <TransactionInfoContainer>
          <TransactionInfo
            title="Transaction fee:"
            value={paymentInfo?.partialFee.toBn()}
            tooltipText="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
          />
        </TransactionInfoContainer>

        <ButtonPrimary size="medium" disabled={!isReady} onClick={sign}>
          Sign and reveal
          <Arrow direction="right" />
        </ButtonPrimary>
      </ModalFooter>
    </TransactionModal>
  )
}
